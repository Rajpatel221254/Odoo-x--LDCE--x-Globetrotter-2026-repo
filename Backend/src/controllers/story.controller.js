import mongoose from 'mongoose';
import Story from '../models/Story.js';

/**
 * GET /api/stories
 *
 * Query params:
 *   search   — text search across title, content, location, tags
 *   category — filter by category (beaches, mountains, heritage, cities, adventure, food)
 *   tag      — filter by hashtag/tag
 *   sort     — 'newest' (default) | 'popular' | 'comments'
 *   page     — page number (default 1)
 *   limit    — results per page (default 20, max 100)
 */
export const getStories = async (req, res, next) => {
  try {
    const { search, category, tag, sort } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = {};

    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      filter.$or = [
        { title: { $regex: trimmedSearch, $options: 'i' } },
        { content: { $regex: trimmedSearch, $options: 'i' } },
        { location: { $regex: trimmedSearch, $options: 'i' } },
        { tags: { $regex: trimmedSearch, $options: 'i' } },
        { author: { $regex: trimmedSearch, $options: 'i' } },
      ];
    }

    if (category && category.trim() && category.toLowerCase() !== 'all') {
      filter.category = category.trim().toLowerCase();
    }

    if (tag && tag.trim()) {
      const formattedTag = tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`;
      filter.tags = { $regex: new RegExp(`^${formattedTag}$`, 'i') };
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'popular') {
      sortOptions = { likes: -1, createdAt: -1 };
    } else if (sort === 'comments') {
      sortOptions = { commentsCount: -1, createdAt: -1 };
    }

    const [stories, total] = await Promise.all([
      Story.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Story.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/stories/:id
 */
export const getStoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid story ID');
      error.statusCode = 400;
      return next(error);
    }

    const story = await Story.findById(id).lean();
    if (!story) {
      const error = new Error('Story not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stories
 *
 * Body payload:
 *   title, content, location, image, category, tags, author, handle, avatar
 */
export const createStory = async (req, res, next) => {
  try {
    const {
      title,
      content,
      location,
      image,
      category,
      tags,
      author,
      handle,
      avatar,
    } = req.body;

    if (!title || !title.trim()) {
      const error = new Error('Story title is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!content || !content.trim()) {
      const error = new Error('Story content is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!image || !image.trim()) {
      const error = new Error('Story image URL is required');
      error.statusCode = 400;
      return next(error);
    }

    // Auto-detect category from text or tags if not provided
    let detectedCategory = (category || '').toLowerCase();
    const validCategories = ['beaches', 'mountains', 'heritage', 'cities', 'adventure', 'food', 'general'];
    if (!validCategories.includes(detectedCategory)) {
      const fullText = `${title} ${content} ${location || ''}`.toLowerCase();
      if (/beach|sea|ocean|goa|maldives|bali|surf|lagoon/.test(fullText)) {
        detectedCategory = 'beaches';
      } else if (/mountain|alps|hike|trek|climb|glacier|snow|summit|pine/.test(fullText)) {
        detectedCategory = 'mountains';
      } else if (/temple|shrine|kyoto|santorini|heritage|monument|unesco|agra|taj|rome|colosseum|paris/.test(fullText)) {
        detectedCategory = 'heritage';
      } else if (/city|tokyo|skylines|york|london|bridge|night|neon|dubai/.test(fullText)) {
        detectedCategory = 'cities';
      } else if (/balloon|cappadocia|safari|camp|vanlife|road trip|aurora|adventure/.test(fullText)) {
        detectedCategory = 'adventure';
      } else if (/food|cafe|bistro|dining|coffee|thali|market|tapas/.test(fullText)) {
        detectedCategory = 'food';
      } else {
        detectedCategory = 'general';
      }
    }

    // Normalize tags
    let formattedTags = [];
    if (Array.isArray(tags)) {
      formattedTags = tags.map((t) => (t.startsWith('#') ? t.trim() : `#${t.trim()}`));
    } else if (typeof tags === 'string' && tags.trim()) {
      formattedTags = tags
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t.trim() : `#${t.trim()}`));
    } else {
      formattedTags = ['#tripmate', '#wanderlust', '#community'];
    }

    // Extract user info if authenticated
    const userId = req.user ? req.user._id : null;
    const finalAuthor = req.user
      ? req.user.name || req.user.username || author || 'Alex Morgan'
      : author || 'Alex Morgan';
    const finalHandle = req.user
      ? `@${req.user.username || 'traveler'}`
      : handle || '@alex_globetrotter';
    const finalAvatar = req.user && req.user.avatar
      ? req.user.avatar
      : avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    const newStory = await Story.create({
      title: title.trim(),
      content: content.trim(),
      location: location ? location.trim() : 'Global Explorer',
      image: image.trim(),
      category: detectedCategory,
      tags: formattedTags,
      author: finalAuthor,
      handle: finalHandle,
      avatar: finalAvatar,
      userId,
      likes: 1,
      likedBy: [userId ? userId.toString() : 'creator'],
      commentsCount: 0,
      comments: [],
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: newStory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stories/:id/like
 *
 * Toggles like on a story
 */
export const toggleLikeStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userIdentifier = req.user
      ? req.user._id.toString()
      : req.body.userId || req.ip || 'anonymous_user';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid story ID');
      error.statusCode = 400;
      return next(error);
    }

    const story = await Story.findById(id);
    if (!story) {
      const error = new Error('Story not found');
      error.statusCode = 404;
      return next(error);
    }

    const alreadyLiked = story.likedBy.includes(userIdentifier);

    if (alreadyLiked) {
      story.likedBy = story.likedBy.filter((uid) => uid !== userIdentifier);
      story.likes = Math.max(0, story.likes - 1);
    } else {
      story.likedBy.push(userIdentifier);
      story.likes += 1;
    }

    await story.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: story.likes,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/stories/:id/comment
 *
 * Adds a comment to a story
 */
export const addCommentStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, author, avatar, handle } = req.body;

    if (!text || !text.trim()) {
      const error = new Error('Comment text is required');
      error.statusCode = 400;
      return next(error);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid story ID');
      error.statusCode = 400;
      return next(error);
    }

    const story = await Story.findById(id);
    if (!story) {
      const error = new Error('Story not found');
      error.statusCode = 404;
      return next(error);
    }

    const newComment = {
      text: text.trim(),
      author: req.user ? req.user.name || req.user.username : author || 'Traveler',
      handle: req.user ? `@${req.user.username}` : handle || '@traveler',
      avatar: req.user?.avatar || avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userId: req.user ? req.user._id : null,
    };

    story.comments.push(newComment);
    story.commentsCount = story.comments.length;
    await story.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/stories/:id
 */
export const deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid story ID');
      error.statusCode = 400;
      return next(error);
    }

    const story = await Story.findById(id);
    if (!story) {
      const error = new Error('Story not found');
      error.statusCode = 404;
      return next(error);
    }

    // If story has userId, only owner can delete unless admin
    if (story.userId && req.user && story.userId.toString() !== req.user._id.toString()) {
      const error = new Error('You are not authorized to delete this story');
      error.statusCode = 403;
      return next(error);
    }

    await Story.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
