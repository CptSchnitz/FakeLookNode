USE [master]
GO

CREATE ROLE db_executor

/* GRANT EXECUTE TO THE ROLE */
GRANT EXECUTE TO db_executor

GO

create login ofer with password = 'Password1234'
/****** Object:  Database [FakeLook]    Script Date: 20/02/2020 4:06:13 PM ******/
CREATE DATABASE [FakeLook]
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

CREATE USER ofer FOR LOGIN ofer;

GO

GRANT EXECUTE TO ofer

GO
/****** Object:  Table [dbo].[Comments]    Script Date: 20/02/2020 4:06:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comments](
	[commentId] [int] IDENTITY(1,1) NOT NULL,
	[text] [nvarchar](500) NULL,
	[postId] [int] NOT NULL,
	[creatorId] [int] NOT NULL,
	[publishDate] [datetime] NOT NULL,
 CONSTRAINT [PK_Comments_1] PRIMARY KEY CLUSTERED 
(
	[commentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsLikes]    Script Date: 20/02/2020 4:06:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsLikes](
	[commentId] [int] NOT NULL,
	[likedById] [int] NOT NULL,
 CONSTRAINT [IX_CommentsLikes] UNIQUE NONCLUSTERED 
(
	[commentId] ASC,
	[likedById] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentsTags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentsTags](
	[commentId] [int] NOT NULL,
	[tagId] [int] NOT NULL,
 CONSTRAINT [IX_CommentsTags] UNIQUE NONCLUSTERED 
(
	[commentId] ASC,
	[tagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CommentUserTags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CommentUserTags](
	[commentId] [int] NOT NULL,
	[taggedUserId] [int] NOT NULL,
 CONSTRAINT [IX_CommentUserTags] UNIQUE NONCLUSTERED 
(
	[commentId] ASC,
	[taggedUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Posts]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[postId] [int] IDENTITY(1,1) NOT NULL,
	[text] [nvarchar](500) NULL,
	[imageUuid] [nvarchar](100) NOT NULL,
	[location] [geography] NOT NULL,
	[publishDate] [datetime] NOT NULL,
	[creatorId] [int] NOT NULL,
 CONSTRAINT [PK_Posts] PRIMARY KEY CLUSTERED 
(
	[postId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsLikes]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsLikes](
	[postId] [int] NOT NULL,
	[likedById] [int] NOT NULL,
 CONSTRAINT [IX_PostsLikes] UNIQUE NONCLUSTERED 
(
	[postId] ASC,
	[likedById] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsTags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsTags](
	[postId] [int] NOT NULL,
	[tagId] [int] NOT NULL,
 CONSTRAINT [IX_PostsTags] UNIQUE NONCLUSTERED 
(
	[postId] ASC,
	[tagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PostsUserTags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PostsUserTags](
	[postId] [int] NOT NULL,
	[taggedUserId] [int] NOT NULL,
 CONSTRAINT [IX_PostsUserTags] UNIQUE NONCLUSTERED 
(
	[postId] ASC,
	[taggedUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tags](
	[tagId] [int] IDENTITY(1,1) NOT NULL,
	[tagName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Tags] PRIMARY KEY CLUSTERED 
(
	[tagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserAuth]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserAuth](
	[userId] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](254) NOT NULL,
	[passwordHash] [nvarchar](300) NULL,
 CONSTRAINT [PK_UserAuth] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UniqueEmail_UserAuth] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[userId] [int] NOT NULL,
	[firstName] [nvarchar](50) NOT NULL,
	[lastName] [nvarchar](50) NOT NULL,
	[address] [nvarchar](200) NOT NULL,
	[workPlace] [nvarchar](100) NOT NULL,
	[birthDate] [date] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [emailIndex_UserAuth]    Script Date: 20/02/2020 4:06:15 PM ******/
CREATE NONCLUSTERED INDEX [emailIndex_UserAuth] ON [dbo].[UserAuth]
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Posts] FOREIGN KEY([postId])
REFERENCES [dbo].[Posts] ([postId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Posts]
GO
ALTER TABLE [dbo].[Comments]  WITH CHECK ADD  CONSTRAINT [FK_Comments_Users] FOREIGN KEY([creatorId])
REFERENCES [dbo].[Users] ([userId])
GO
ALTER TABLE [dbo].[Comments] CHECK CONSTRAINT [FK_Comments_Users]
GO
ALTER TABLE [dbo].[CommentsTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentsTags_Comments] FOREIGN KEY([commentId])
REFERENCES [dbo].[Comments] ([commentId])
GO
ALTER TABLE [dbo].[CommentsTags] CHECK CONSTRAINT [FK_CommentsTags_Comments]
GO
ALTER TABLE [dbo].[CommentsTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentsTags_Tags] FOREIGN KEY([tagId])
REFERENCES [dbo].[Tags] ([tagId])
GO
ALTER TABLE [dbo].[CommentsTags] CHECK CONSTRAINT [FK_CommentsTags_Tags]
GO
ALTER TABLE [dbo].[CommentUserTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentUserTags_Comments] FOREIGN KEY([commentId])
REFERENCES [dbo].[Comments] ([commentId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CommentUserTags] CHECK CONSTRAINT [FK_CommentUserTags_Comments]
GO
ALTER TABLE [dbo].[CommentUserTags]  WITH CHECK ADD  CONSTRAINT [FK_CommentUserTags_Users] FOREIGN KEY([taggedUserId])
REFERENCES [dbo].[Users] ([userId])
GO
ALTER TABLE [dbo].[CommentUserTags] CHECK CONSTRAINT [FK_CommentUserTags_Users]
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [FK_Posts_Users1] FOREIGN KEY([creatorId])
REFERENCES [dbo].[Users] ([userId])
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [FK_Posts_Users1]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK_PostsLikes_Posts] FOREIGN KEY([postId])
REFERENCES [dbo].[Posts] ([postId])
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK_PostsLikes_Posts]
GO
ALTER TABLE [dbo].[PostsLikes]  WITH CHECK ADD  CONSTRAINT [FK_PostsLikes_Users] FOREIGN KEY([likedById])
REFERENCES [dbo].[Users] ([userId])
GO
ALTER TABLE [dbo].[PostsLikes] CHECK CONSTRAINT [FK_PostsLikes_Users]
GO
ALTER TABLE [dbo].[PostsTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsTags_Posts] FOREIGN KEY([postId])
REFERENCES [dbo].[Posts] ([postId])
GO
ALTER TABLE [dbo].[PostsTags] CHECK CONSTRAINT [FK_PostsTags_Posts]
GO
ALTER TABLE [dbo].[PostsTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsTags_Tags] FOREIGN KEY([tagId])
REFERENCES [dbo].[Tags] ([tagId])
GO
ALTER TABLE [dbo].[PostsTags] CHECK CONSTRAINT [FK_PostsTags_Tags]
GO
ALTER TABLE [dbo].[PostsUserTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsUserTags_Posts] FOREIGN KEY([postId])
REFERENCES [dbo].[Posts] ([postId])
GO
ALTER TABLE [dbo].[PostsUserTags] CHECK CONSTRAINT [FK_PostsUserTags_Posts]
GO
ALTER TABLE [dbo].[PostsUserTags]  WITH CHECK ADD  CONSTRAINT [FK_PostsUserTags_Users] FOREIGN KEY([taggedUserId])
REFERENCES [dbo].[Users] ([userId])
GO
ALTER TABLE [dbo].[PostsUserTags] CHECK CONSTRAINT [FK_PostsUserTags_Users]
GO
ALTER TABLE [dbo].[Users]  WITH NOCHECK ADD  CONSTRAINT [FK_Users_UserAuth1] FOREIGN KEY([userId])
REFERENCES [dbo].[UserAuth] ([userId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_UserAuth1]
GO
/****** Object:  StoredProcedure [dbo].[AddCommentLike]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[AddCommentLike] 
	-- The comment to add like to.
	@commentId int, 

	-- that user that liked the comment
	@likedById int
AS
BEGIN
	SET NOCOUNT ON;

insert into [dbo].[CommentsLikes] (commentId, likedById)
      values (@commentId, @likedById)

END
GO
/****** Object:  StoredProcedure [dbo].[AddPostLike]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[AddPostLike] 
	-- the post to add a like to.
	@postId int, 

	-- the user that liked the post
	@likedById int
AS
BEGIN

	SET NOCOUNT ON;

insert into [dbo].[PostsLikes] (postId, likedById)
      values (@postId, @likedById)

END
GO
/****** Object:  StoredProcedure [dbo].[CreateAuthUser]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[CreateAuthUser] 
	-- The email of the user. it should be unique.
	@email nvarchar(254), 

	-- password hashed using bcrypt. should be hashed before.
	@passwordHash nvarchar(300),

	@userId int output
AS
BEGIN

	SET NOCOUNT ON;

INSERT INTO [dbo].[UserAuth]
           ([email]
           ,[passwordHash])
     VALUES
           (@email,
           @passwordHash)

	-- returns the id of the created user.
	set @userId = scope_identity()

END
GO
/****** Object:  StoredProcedure [dbo].[CreateComment]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Ofer
-- =============================================
CREATE PROCEDURE [dbo].[CreateComment] 

	-- the id of the post that the comment belongs to.
	@postId int,

	-- the user that added the comment
	@creatorId int,

	-- the time the comment was published.
	@publishDate datetime,

	-- the text of the comment
	@text nvarchar(500) = null,

	-- the user that are tagged as part of the comment.
	-- should be an json array [1,2,3]
	@userTags nvarchar(1000) = null,

	-- the tags of the comment.
	-- should be an json array of strings - ["alpha","bravo"]
	@tags nvarchar(1000) = null,

	@commentId int output
AS
BEGIN

	SET NOCOUNT ON;

	-- inserting the comment itself.
	INSERT INTO [dbo].[Comments]
	           ([text],
	           [postId],
			   [publishDate],
	           creatorId)
	     VALUES
	           (@text,
	           @postId,
			   @publishDate,
	           @creatorId)

	set @commentId = SCOPE_IDENTITY()

	-- inserting the user tags of the comment
	INSERT INTO [dbo].[CommentUserTags] ([commentId],[taggedUserId])
		SELECT @commentId, j.value from openjson(@userTags) as j

	-- adding the tags that dont exist into the tags table.
	INSERT INTO [dbo].[Tags] ([tagName])
		select value from openjson(@tags)
		where value not in (select tagName from [dbo].[Tags])

	-- inseting the comment tags
	insert into [dbo].[CommentsTags] ([commentId], [tagId])
		select @commentId, [tagId] from Tags
		where tagName in (select value from openjson(@tags))
END
GO
/****** Object:  StoredProcedure [dbo].[CreatePost]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[CreatePost] 

	-- the uuid used to obtain the image.
	@imageUuid nvarchar(100), 

	-- the id of the user that created the post
	@creatorId int,

	-- the location of the post
	@lng float,
	@lat float,

	-- the post publish date
	@publishDate datetime,

	-- the text content of the post
	@text nvarchar(500) = null,


	-- the tags of the post.
	-- should be an json array of strings - ["alpha","bravo"]
	@tags nvarchar(4000),

	-- the user that are tagged as part of the post.
	-- should be an json array [1,2,3]
	@userTags nvarchar(4000),

	@postId int output


AS
BEGIN

	--create the geography object of the location.
	DECLARE @location AS geography = geography::Point(@Lat,@Lng, 4326)
	SET NOCOUNT ON;

	-- inserting the post itself
	INSERT INTO [dbo].[Posts]
           ([Text]
           ,[imageUuid]
           ,[Location]
           ,[PublishDate]
           ,[creatorId])
    VALUES
           (@text
           ,@imageUuid
           ,@location
           ,@publishDate
           ,@creatorId)


	set @PostId = SCOPE_IDENTITY()

	-- inserting the post tagged users
	INSERT INTO [dbo].[PostsUserTags] ([postId],[taggedUserId])
	SELECT @postId, j.value from openjson(@userTags) as j

	-- inserting the tags that doesnt exist in the tags table
	INSERT INTO [dbo].[Tags] ([tagName])
	select value from openjson(@tags)
	where value not in (select [tagName] from [dbo].Tags)

	-- inserting the post tags
	insert into [dbo].[PostsTags] ([postId], [tagId])
	select @postId, [tagId] from [Tags]
	where [tagName] in (select value from openjson(@tags))

END
GO
/****** Object:  StoredProcedure [dbo].[CreateUser]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		ofer
-- =============================================
CREATE PROCEDURE [dbo].[CreateUser] 
	@firstName nvarchar(50), 
	@lastName nvarchar(50),
	@address nvarchar(200),
	@workPlace nvarchar(100),
	@birthDate date,
	@userId int
AS
BEGIN
	SET NOCOUNT ON;

	insert into Users
	values (@userId,
			@FirstName,
			@LastName,
			@Address,
			@WorkPlace,
			@BirthDate)
END
GO
/****** Object:  StoredProcedure [dbo].[DeleteAuthUser]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DeleteAuthUser]
	-- Add the parameters for the stored procedure here
	@authId int
AS
BEGIN
	SET NOCOUNT ON;

DELETE FROM [dbo].[UserAuth]
      WHERE [userId] = @authId

END
GO
/****** Object:  StoredProcedure [dbo].[DeleteCommentLike]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[DeleteCommentLike] 
	@commentId int, 
	@likedById int
AS
BEGIN

	SET NOCOUNT ON;


DELETE FROM [dbo].[CommentsLikes]
      WHERE [commentId] = @commentId and [likedById] = @likedById;

END
GO
/****** Object:  StoredProcedure [dbo].[DeletePostLike]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[DeletePostLike] 

	@postId int, 
	@likedById int
AS
BEGIN

	SET NOCOUNT ON;

    -- Insert statements for procedure here

DELETE FROM [dbo].[PostsLikes]
      WHERE PostId = @postId and [likedById] = @likedById;

END
GO
/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetAllUsers] 

AS
BEGIN
	SET NOCOUNT ON;

	select [firstName], [lastName], [Users].[userId]
	from [Users]
END
GO
/****** Object:  StoredProcedure [dbo].[GetAuthUserByEmail]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetAuthUserByEmail] 
	@email nvarchar(254)
AS
BEGIN

	SET NOCOUNT ON;

	SELECT *
	from UserAuth
	where email = @email
END
GO
/****** Object:  StoredProcedure [dbo].[GetCommentbyId]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentbyId] 
	-- Add the parameters for the stored procedure here
	@commentId int,
	@likedById int = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT [commentId], [postId], [text], [publishDate], [Users].[userId] as [creator.userId],
			 [firstName] as [creator.firstName], lastName as [creator.lastName], 

		(select count(*) 
			from [CommentsLikes] 
			where [CommentsLikes].[commentId] = [Comments].[commentId]) as [likes],

		(select [firstName], [lastName], [users].[userId] 
			from [CommentUserTags] join [Users] on [CommentUserTags].[commentId] = [Comments].[commentId]
			and [CommentUserTags].[taggedUserId] = [Users].[userId] for json auto) as [userTags],

		(select [tags].[tagId] as [id], [tagName] as [name] from [CommentsTags] join [Tags] 
			on [CommentsTags].[commentId] = [Comments].[commentId]
			and [CommentsTags].[tagId] = [Tags].[tagId] for json auto) as [tags],

	likedByUser = case when @likedById in (select [userId] from [CommentsLikes] 
											where [commentId] = @commentId) then 1 else 0 end

	from [Comments] join [Users] on [Comments].[creatorId] = [Users].[userId]
	where [commentId] = @commentId
	for json path
END
GO
/****** Object:  StoredProcedure [dbo].[GetCommentsByPostId]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetCommentsByPostId] 
	@postId int,
	@likedById int = null
AS
BEGIN

	SET NOCOUNT ON;

	SELECT [commentId], @postId as [postId], [text],[publishDate] ,
			Users.UserId as [creator.userId], firstName as [creator.firstName], lastName as [creator.lastName],

		(select count(*) 
			from [CommentsLikes] 
			where [CommentsLikes].[commentId] = [Comments].[commentId]) as [likes],

		(select [firstName], [lastName], [users].[userId] 
			from [CommentUserTags] join [Users] on [CommentUserTags].[commentId] = [Comments].[commentId] 
			and [CommentUserTags].[taggedUserId] = [Users].[userId] for json auto) as [userTags],

		(select [Tags].[tagId] as [id], [tagName] as [name] from [CommentsTags] join [Tags] 
			on [CommentsTags].[commentId] = [Comments].[commentId] 
			and [CommentsTags].[tagId] = [Tags].[tagId] for json auto) as [tags],

		likedByUser = case when @likedById in (select [userId] from 
			[CommentsLikes] where [commentId] = [Comments].[commentId]) then 1 else 0 end

	from [Comments] join [Users] on [Comments].[creatorId] = [Users].[userId]
	where [postId] = @postId
	for json path
END
GO
/****** Object:  StoredProcedure [dbo].[GetPostById]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetPostById] 
	@postId int,
	@likedById int = null
AS
BEGIN

	SET NOCOUNT ON;

	SELECT [Posts].[text], [Posts].[imageUuid],  [Posts].[location].Long as [location.lng],
		 [Posts].[location].Lat as [location.lat], [Posts].[postId], [Posts].[publishDate],

	(select [userId], [firstName], [lastName] from [Users] 
		where [userId] = [Posts].[creatorId] for json auto) as [creator],

	(select count(*) from [PostsLikes] where [postId] = @postId) as [likes],
	(select [Tags].[tagName] as [name], [Tags].[tagId] as [id]
		from [PostsTags] join [Tags] on [PostsTags].[tagId] = [Tags].[tagId]
		where [postId] = @postId
		for json auto) as [Tags],

	(select [Users].[userId] as [id], [firstName], [lastName]
	from [PostsUserTags] join [Users] on [PostsUserTags].[taggedUserId] = [Users].[userId]
	where [postId] = @postId
	for json auto) as [userTags],

	likedByUser = case when @likedById in 
		(select [likedById] from [PostsLikes] where [postId] = @postId) then 1 else 0 end

	from Posts
	where PostId = @PostId
	for json path


END
GO
/****** Object:  StoredProcedure [dbo].[GetPosts]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetPosts] 
	-- Add the parameters for the stored procedure here
	@lng float = null,
	@lat float = null,
	@distance int = null,
	@startDate datetime = null,
	@endDate datetime = null,
	@tags nvarchar(4000) = null,
	@userTags nvarchar(4000) = null,
	@publishers nvarchar(4000) = null,
	@orderBy nvarchar(50) = null,
	@likedById int = null
AS
BEGIN
	declare @postIdTable TABLE ([postId] varchar(50))

	-- create the location variable
	IF @lng is not null
	BEGIN
		DECLARE @location AS geography = geography::Point(@lat, @lng, 4326)
		DECLARE @range AS geography = @location.STBuffer(@distance)
	END

	insert into @postIdTable
	select [Posts].[postId]
	from Posts 
	where (@lng is null or [Posts].[location].STIntersects(@Range) = 1)
		and (@startDate is null or [Posts].[publishDate] >= @startDate)
		and (@endDate is null or [Posts].[publishDate] < @endDate)
		and (@publishers is null or [Posts].[creatorId] in (select value from openjson(@publishers)))

	-- filter by tags
	if @tags is not null
	begin
		DECLARE @tmpTagsTable TABLE ([name] varchar(50))
		insert into @tmpTagsTable
		select value from openjson(@tags);

		delete from @postIdTable
		where [postId] not in (
			select [postId]
				from [Tags] join [PostsTags] on [Tags].[tagId] = [PostsTags].[tagId]
				where [tags].[tagName] in (select * from @tmpTagsTable)
			union
				select [postId]
				from [Tags] join [CommentsTags] on [tags].[tagId] = [CommentsTags].[tagId]
					join [Comments] on [CommentsTags].[commentId] = [Comments].[commentId]
				where [tags].[tagName] in (select * from @tmpTagsTable))
	end

	-- filter by user tags
		if @userTags is not null
	begin
        DECLARE @tmpUserTagsTable TABLE ([UserId] int)
        insert into @tmpUserTagsTable
        select value from openjson(@userTags);

		delete from @postIdTable
		where [postId] not in (
			select [postId]
				from [PostsUserTags]
				where [PostsUserTags].[taggedUserId] in (select * from @tmpUserTagsTable)
			union
			select [postId]
				from [CommentUserTags] join [Comments] on [CommentUserTags].[commentId] = [Comments].[commentId]
				where [CommentUserTags].[taggedUserId] in (select * from @tmpTagsTable))
	end


	select [Posts].[postId], [Posts].[imageUuid], [Posts].[location].Long as [location.lng],
		[Posts].[location].Lat as [location.lat], [publishDate],
		[text], [userid] as [creator.id], [Users].[firstName] as [creator.firstName],
		[Users].[lastName] as [creator.lastName], count([PostsLikes].[likedById]) as [likes],

		likedByUser = case when @likedById in 
			(select [userId] from [PostsLikes] where [postId] = [Posts].[postId]) then 1 else 0 end

	from [Posts] join [Users] on [Posts].[creatorId] = [Users].[userId] 
		left join [PostsLikes] on [PostsLikes].[postId] = [Posts].[postId]

	where [Posts].[postId] in (select * from @postIdTable)

	group by [Posts].[postId], [Posts].[imageUuid], [Posts].[location].Long,
	[Posts].[location].Lat, [posts].[publishDate],
		[text], [Users].[userId], [Users].[firstName], [Users].[lastName]
	order by
		case when @orderBy is null then [Posts].[postId]
		when @orderBy = 'date' then [Posts].[publishDate]
		when @orderBy = 'likes' then (select count([likedById]) 
			from [PostsLikes] where [PostsLikes].[postId] = [Posts].[postId])
	end desc
	for json path
END
GO
/****** Object:  StoredProcedure [dbo].[GetTags]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- Create date: 
-- Description:	
-- =============================================
CREATE PROCEDURE [dbo].[GetTags] 
	-- Add the parameters for the stored procedure here
@filter NVARCHAR(50) = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select [tagId], [tagName] as [name]
	from Tags
	where (@filter is null) or charindex(upper(@filter) ,upper([tagName])) > 0
	
END
GO
/****** Object:  StoredProcedure [dbo].[GetUserById]    Script Date: 20/02/2020 4:06:15 PM ******/
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
	@userId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	from Users
	where UserId = @UserId
END
GO
/****** Object:  StoredProcedure [dbo].[GetUsers]    Script Date: 20/02/2020 4:06:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ofer
-- =============================================
CREATE PROCEDURE [dbo].[GetUsers] 
@filter NVARCHAR(50) = null
AS
BEGIN
	SET NOCOUNT ON;

	select [firstName], [lastName], [users].[userId]
	from Users
	where (@filter is null) or charindex(upper(@filter) ,upper(Users.firstName + ' ' + Users.lastName)) > 0
	
END
GO
USE [master]
GO
ALTER DATABASE [FakeLook] SET  READ_WRITE 
GO
