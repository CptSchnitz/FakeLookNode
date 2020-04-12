module.exports = (mappings, addLikeBody, removeLikeBody) => async (client) => {
  const indexExists = await client.indices.exists({ index: 'fakelook-posts' });
  if (!indexExists.body) {
    await client.indices.create({ index: 'fakelook-posts', body: mappings });
  }

  try {
    await client.getScript({ id: 'add-like' });
  } catch (error) {
    if (error.name === 'ResponseError' && !error.meta.body.found) {
      await client.putScript({ id: 'add-like', body: addLikeBody });
    } else {
      throw error;
    }
  }
  try {
    await client.getScript({ id: 'remove-like' });
  } catch (error) {
    if (error.name === 'ResponseError' && !error.meta.body.found) {
      await client.putScript({ id: 'remove-like', body: removeLikeBody });
    } else {
      throw error;
    }
  }
};
