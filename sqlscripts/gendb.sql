USE [master]
GO
/****** Object:  Database [FakeLook]    Script Date: 08/02/2020 17:22:13 ******/
CREATE DATABASE [FakeLook]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FakeLook', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FakeLook.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FakeLook_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\FakeLook_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [FakeLook] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FakeLook].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FakeLook] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FakeLook] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FakeLook] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FakeLook] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FakeLook] SET ARITHABORT OFF 
GO
ALTER DATABASE [FakeLook] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FakeLook] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FakeLook] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FakeLook] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FakeLook] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FakeLook] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FakeLook] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FakeLook] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FakeLook] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FakeLook] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FakeLook] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FakeLook] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FakeLook] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FakeLook] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FakeLook] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FakeLook] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FakeLook] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FakeLook] SET RECOVERY FULL 
GO
ALTER DATABASE [FakeLook] SET  MULTI_USER 
GO
ALTER DATABASE [FakeLook] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FakeLook] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FakeLook] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FakeLook] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FakeLook] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'FakeLook', N'ON'
GO
ALTER DATABASE [FakeLook] SET QUERY_STORE = OFF
GO
USE [FakeLook]
GO
/****** Object:  Table [dbo].[Comments]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[CommentId] [int] IDENTITY(1,1) NOT NULL,
	[Text] [nvarchar](500) NULL,
	[PostId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_Comments_1] PRIMARY KEY CLUSTERED 
(
	[CommentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsLikes]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsLikes](
	[CommentId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [IX_CommentsLikes] UNIQUE NONCLUSTERED 
(
	[CommentId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsTags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsTags](
	[CommentId] [int] NOT NULL,
	[TagId] [int] NOT NULL,
 CONSTRAINT [IX_CommentsTags] UNIQUE NONCLUSTERED 
(
	[CommentId] ASC,
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentUserTags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentUserTags](
	[CommentId] [int] NULL,
	[UserId] [int] NULL,
 CONSTRAINT [IX_CommentUserTags] UNIQUE NONCLUSTERED 
(
	[CommentId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Posts]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[PostId] [int] IDENTITY(1,1) NOT NULL,
	[Text] [nvarchar](500) NULL,
	[Image] [nvarchar](100) NOT NULL,
	[Location] [geography] NOT NULL,
	[PublishDate] [datetime] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_Posts] PRIMARY KEY CLUSTERED 
(
	[PostId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsLikes]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsLikes](
	[PostId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [IX_PostsLikes] UNIQUE NONCLUSTERED 
(
	[PostId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsTags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsTags](
	[PostId] [int] NOT NULL,
	[TagId] [int] NOT NULL,
 CONSTRAINT [IX_PostsTags] UNIQUE NONCLUSTERED 
(
	[PostId] ASC,
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsUserTags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsUserTags](
	[PostId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [IX_PostsUserTags] UNIQUE NONCLUSTERED 
(
	[PostId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tags](
	[TagId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Tags] PRIMARY KEY CLUSTERED 
(
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Address] [nvarchar](200) NOT NULL,
	[WorkPlace] [nvarchar](100) NOT NULL,
	[BirthDate] [date] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Posts] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([PostId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Posts]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Users]
GO
ALTER TABLE [dbo].[CommentsTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentsTags_Comments] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([CommentId])
GO
ALTER TABLE [dbo].[CommentsTags] CHECK CONSTRAINT [FK_CommentsTags_Comments]
GO
ALTER TABLE [dbo].[CommentsTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentsTags_Tags] FOREIGN KEY([TagId])
REFERENCES [dbo].[Tags] ([TagId])
GO
ALTER TABLE [dbo].[CommentsTags] CHECK CONSTRAINT [FK_CommentsTags_Tags]
GO
ALTER TABLE [dbo].[CommentUserTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentUserTags_Comments] FOREIGN KEY([CommentId])
REFERENCES [dbo].[Comments] ([CommentId])
GO
ALTER TABLE [dbo].[CommentUserTags] CHECK CONSTRAINT [FK_CommentUserTags_Comments]
GO
ALTER TABLE [dbo].[CommentUserTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentUserTags_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[CommentUserTags] CHECK CONSTRAINT [FK_CommentUserTags_Users]
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [FK_Posts_Users1] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [FK_Posts_Users1]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK_PostsLikes_Posts] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([PostId])
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK_PostsLikes_Posts]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK_PostsLikes_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK_PostsLikes_Users]
GO
ALTER TABLE [dbo].[PostsTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsTags_Posts] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([PostId])
GO
ALTER TABLE [dbo].[PostsTags] CHECK CONSTRAINT [FK_PostsTags_Posts]
GO
ALTER TABLE [dbo].[PostsTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsTags_Tags] FOREIGN KEY([TagId])
REFERENCES [dbo].[Tags] ([TagId])
GO
ALTER TABLE [dbo].[PostsTags] CHECK CONSTRAINT [FK_PostsTags_Tags]
GO
ALTER TABLE [dbo].[PostsUserTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsUserTags_Posts] FOREIGN KEY([PostId])
REFERENCES [dbo].[Posts] ([PostId])
GO
ALTER TABLE [dbo].[PostsUserTags] CHECK CONSTRAINT [FK_PostsUserTags_Posts]
GO
ALTER TABLE [dbo].[PostsUserTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsUserTags_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[PostsUserTags] CHECK CONSTRAINT [FK_PostsUserTags_Users]
GO
/****** Object:  StoredProcedure [dbo].[CreatePost]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[CreatePost] 
	-- Add the parameters for the stored procedure here
	@Image nvarchar(100), 
	@Text nvarchar(500) = null,
	@Lng float,
	@Lat float,
	@PublishDate nvarchar(50),
	@UserId int,
	@tags nvarchar(4000),
	@userTags nvarchar(4000),
	@PostId int output

	--SELECT value FROM OPENJSON( CHAR(91) + @List + CHAR(93))
	--vs
	--SELECT value FROM STRING_SPLIT(@List, @Delimiter)
	--vs
	--TVP

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	DECLARE 
	@location AS geography = geography::Point(@Lat,@Lng, 4326)
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	INSERT INTO [dbo].[Posts]
           ([Text]
           ,[Image]
           ,[Location]
           ,[PublishDate]
           ,[UserId])
    VALUES
           (@Text
           ,@Image
           ,@Location
           ,@PublishDate
           ,@UserId)


	set @PostId = SCOPE_IDENTITY()

	INSERT INTO [dbo].[PostsUserTags] ([PostId],[UserId])
	SELECT @PostId, j.value from openjson(@userTags) as j

	INSERT INTO [dbo].[Tags] ([Name])
	select value from openjson(@tags)
	where value not in (select Name from [dbo].Tags)

	insert into [dbo].[PostsTags] (PostId, TagId)
	select @PostId, TagId from Tags
	where Name in (select value from openjson(@tags))



END
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[CreateUser] 
	-- Add the parameters for the stored procedure here
	@FirstName nvarchar(50), 
	@LastName nvarchar(50),
	@Address nvarchar(200),
	@WorkPlace nvarchar(100),
	@BirthDate date,
	@UserId int output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Users
	values(@FirstName,@LastName,@Address,@WorkPlace,@BirthDate)

	set @UserId = SCOPE_IDENTITY()
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetAllUsers] 
	-- Add the parameters for the stored procedure here

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select firstName, lastName, users.UserId as userId
	from Users
END
GO
/****** Object:  StoredProcedure [dbo].[GetPostById]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPostById] 
	-- Add the parameters for the stored procedure here
	@PostId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT Posts.Text [text], Posts.Image [image], Posts.Location.STAsText() [location], Posts.PostId [id], Posts.PublishDate [publishDate],
	(select UserId, FirstName +' '+ LastName as Name from Users where UserId = Posts.UserId for json auto) as [Creator],
	(select Users.UserId as UserId, FirstName + ' ' + LastName as Name 
	from PostsLikes join Users on PostsLikes.UserId = Users.UserId
	where PostId = @PostId for json auto) as [Likes],
		(select Tags.TagId as Id, Tags.Name as Name
	from PostsTags join Tags on PostsTags.TagId = Tags.TagId
	where PostId = @PostId
	for json auto) as [tags],

	(select Users.UserId as Id, FirstName + ' ' + LastName as Name 
	from PostsUserTags join Users on PostsUserTags.UserId = Users.UserId
	where PostId = @PostId
	for json auto) as [UserTags]
	from Posts
	where PostId = @PostId
	for json path


END


	--PostTags
	--AS
	--(select Tags.TagId as Id, Tags.Name as Name
	--from PostsTags join Tags on PostsTags.TagId = Tags.TagId
	--where PostId = 2
	--),

	--PostUserTags
	--AS
	--(select Users.UserId as Id, FirstName + ' ' + LastName as Name 
	--from PostsUserTags join Users on PostsUserTags.UserId = Users.UserId
	--where PostId = 2
	--)
GO
/****** Object:  StoredProcedure [dbo].[GetPosts]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetPosts] 
	-- Add the parameters for the stored procedure here
	@lng float = null,
	@lat float = null,
	@distance float = null,
	@startDate datetime = null,
	@endDate datetime = null,
	@tags nvarchar(4000) = null,
	@userTags nvarchar(4000) = null,
	@publishers nvarchar(4000) = null,
	@orderBy nvarchar(50) = null
AS
BEGIN
	declare @postIdTable TABLE ([postId] varchar(50))

	-- create the location params
	IF @lng is not null
	BEGIN
    -- Insert statements for procedure here
		DECLARE @location AS geography = geography::Point(@lng, @lat, 4326)
		DECLARE @range AS geography = @location.STBuffer(@distance)
	END

	insert into @postIdTable
	select Posts.PostId
	from Posts 
	where (@lng is null or Posts.Location.STIntersects(@Range) = 1)
		and (@startDate is null or Posts.PublishDate >= @startDate)
		and (@endDate is null or Posts.PublishDate < @endDate)
		and (@publishers is null or Posts.UserId in (select value from openjson(@publishers)))

	-- filter by tags
	if @tags is not null
	begin
		DECLARE @tmpTagsTable TABLE ([Name] varchar(50))
		insert into @tmpTagsTable
		select value from openjson(@tags);

		delete from @postIdTable
		where postId not in (
			select PostId
				from Tags join PostsTags on Tags.TagId = PostsTags.TagId
				where tags.Name in (select * from @tmpTagsTable)
			union
				select PostId
				from Tags join CommentsTags on tags.TagId = CommentsTags.TagId
					join Comments on CommentsTags.CommentId = Comments.CommentId
				where tags.Name in (select * from @tmpTagsTable))
	end

	-- filter by user tags
		if @userTags is not null
	begin
        DECLARE @tmpUserTagsTable TABLE ([UserId] int)
        insert into @tmpUserTagsTable
        select value from openjson(@userTags);

		delete from @postIdTable
		where postId not in (
			select PostId
				from PostsUserTags
				where PostsUserTags.UserId in (select * from @tmpUserTagsTable)
			union
			select PostId
				from CommentUserTags join Comments on CommentUserTags.CommentId = Comments.CommentId
				where CommentUserTags.UserId in (select * from @tmpTagsTable))
	end

	select Posts.PostId, Posts.Image, Posts.Location.Long as Lng, Posts.Location.Lat as Lat, posts.PublishDate,
		Posts.Text, Users.UserId, Users.FirstName + ' ' + Users.LastName as UserFullName, count(PostsLikes.UserId) as PostLikes
	from Posts join Users on Posts.UserId = Users.UserId 
		left join PostsLikes on PostsLikes.PostId = Posts.PostId
	where Posts.PostId in (select * from @postIdTable)
	group by Posts.PostId, Posts.Image, Posts.Location.Long, Posts.Location.Lat, posts.PublishDate,
		Posts.Text, Users.UserId, Users.FirstName + ' ' + Users.LastName
	order by
		case when @orderBy is null then Posts.PostId
		when @orderBy = 'date' then Posts.PublishDate 
		when @orderBy = 'likes' then (select count(UserId) from PostsLikes where PostsLikes.PostId = Posts.PostId)
	end desc
END
--openjson(@userTags) as j
GO
/****** Object:  StoredProcedure [dbo].[GetTags]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
create PROCEDURE [dbo].[GetTags] 
	-- Add the parameters for the stored procedure here
@filter NVARCHAR(50) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select TagId as tagId, Name as name
	from Tags
	where (@filter is null) or charindex(upper(@filter) ,upper(Name)) > 0
	
END
GO
/****** Object:  StoredProcedure [dbo].[GetUserById]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetUserById] 
	-- Add the parameters for the stored procedure here
	@UserId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	from Users
	where UserId = @UserId
END
GO
/****** Object:  StoredProcedure [dbo].[GetUsers]    Script Date: 08/02/2020 17:22:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetUsers] 
	-- Add the parameters for the stored procedure here
@filter NVARCHAR(50) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select firstName, lastName, users.UserId as userId
	from Users
	where (@filter is null) or charindex(upper(@filter) ,upper(Users.FirstName + ' ' + Users.LastName)) > 0
	
END
GO
USE [master]
GO
ALTER DATABASE [FakeLook] SET  READ_WRITE 
GO
