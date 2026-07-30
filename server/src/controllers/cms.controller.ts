import { Request, Response } from 'express';
import CmsBlock from '../models/CmsBlock';

export const getCmsBlocks = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter = type ? { type: type as string, isActive: true } : {};
    const blocks = await CmsBlock.find(filter).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: blocks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCmsBlockById = async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const block = await CmsBlock.findOne({ blockId });
    if (!block) {
      return res.status(404).json({ success: false, message: 'CMS Block not found' });
    }
    return res.status(200).json({ success: true, data: block });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertCmsBlock = async (req: Request, res: Response) => {
  try {
    const { blockId, type, title, subtitle, content, mediaUrl, ctaText, ctaLink, isActive, order } = req.body;

    if (!blockId || !type) {
      return res.status(400).json({ success: false, message: 'blockId and type are required' });
    }

    const block = await CmsBlock.findOneAndUpdate(
      { blockId },
      {
        blockId,
        type,
        title,
        subtitle,
        content,
        mediaUrl,
        ctaText,
        ctaLink,
        isActive: isActive ?? true,
        order: order ?? 0,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'CMS block saved successfully',
      data: block,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCmsBlock = async (req: Request, res: Response) => {
  try {
    const { blockId } = req.params;
    const block = await CmsBlock.findOneAndDelete({ blockId });
    if (!block) {
      return res.status(404).json({ success: false, message: 'CMS block not found' });
    }
    return res.status(200).json({ success: true, message: 'CMS block deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
