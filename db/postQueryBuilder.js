const distanceBuilder = (lat, lon, distance) => ({
  geo_distance: {
    distance,
    location: {
      lat,
      lon,
    },
  },
});

const dateRangeBuilder = (minDate, maxDate) => {
  const dateFilter = {
    range: {
      publishDate: {},
    },
  };

  if (minDate) {
    dateFilter.range.publishDate.gte = minDate;
  }

  if (maxDate) {
    dateFilter.range.publishDate.lt = maxDate;
  }

  return dateFilter;
};

const publishersBuilder = (publishers) => ({
  terms: {
    'creator.userId': publishers,
  },
});

const tagsBuilder = (tags) => {
  const filters = tags.map((tag) => ({
    bool: {
      should: [{
        has_child: {
          type: 'comment',
          query: {
            term: {
              tags: {
                value: tag,
              },
            },
          },
        },
      },
      {
        term: { tags: { value: tag } },
      }],
    },
  }));

  return { bool: { filter: filters } };
};

const userTagsBuilder = (userTags) => {
  const filters = userTags.map((userTag) => ({
    bool: {
      should: [{
        has_child: {
          type: 'comment',
          query: {
            term: {
              'userTags.userId': {
                value: userTag,
              },
            },
          },
        },
      },
      {
        term: { 'userTags.userId': { value: userTag } },
      }],
    },
  }));

  return { bool: { filter: filters } };
};

const queryBuilder = (postFilter) => {
  const filters = [];
  if (postFilter.lon && postFilter.lat && postFilter.distance) {
    filters.push(distanceBuilder(postFilter.lat, postFilter.lon, postFilter.distance));
  }

  if (postFilter.minDate || postFilter.maxDate) {
    filters.push(dateRangeBuilder(postFilter.minDate, postFilter.maxDate));
  }
  if (postFilter.publishers) {
    filters.push(publishersBuilder(postFilter.publishers));
  }

  if (postFilter.userTags) {
    filters.push(userTagsBuilder(postFilter.userTags));
  }

  if (postFilter.tags) {
    filters.push(tagsBuilder(postFilter.tags));
  }

  const postsFilter = {
    term: { postCommentJoin: { value: 'post' } },
  };

  if (filters.length > 0) {
    filters.push(postsFilter);
    return {
      bool: { filter: filters },
    };
  }

  return postsFilter;
};

const sortBuilder = (orderBy) => {
  const obj = {};
  obj[orderBy === 'date' ? 'publishDate' : 'likes'] = { order: 'desc' };
  return obj;
};

const getSearchQuery = (postFilter) => {
  const { orderBy, ...filters } = postFilter;
  return {
    query: queryBuilder(filters),
    sort: sortBuilder(orderBy || 'publishDate'),
  };
};

module.exports = { getSearchQuery };
