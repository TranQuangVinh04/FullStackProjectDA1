import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '../constants/http';

//middleware validate post
export const validatePost = (req: Request, res: Response, next: NextFunction) => {
        const { content } = req.body;
        const files = req.files as Express.Multer.File[];

        if (!content && (!files || files.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Bài viết phải có nội dung hoặc media'
            });
        }

        if (content && content.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Nội dung không được vượt quá 1000 ký tự'
            });
        }

        if (files && files.length > 8) {
            return res.status(400).json({
                success: false,
                message: 'Tối đa 8 file được phép upload'
            });
        }
        if (files) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
            const invalidFiles = files.filter(file => !allowedTypes.includes(file.mimetype));
            
            if (invalidFiles.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Chỉ chấp nhận file ảnh (jpg, png, gif) hoặc video (mp4, mov)'
                });
            }
        }
        // Kiểm tra kích thước file
    if (files) {
        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                return res.status(BAD_REQUEST).json({
                    success: false,
                    error: "Kích thước file không được vượt quá 5MB"
                });
            }
        }
    }

       
        next();

};

//middleware validate comment
export const validateComment = (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({
            success: false,
            message: 'Bình luận không được để trống'    
        });
    }
    if (content.length > 200) {
        return res.status(400).json({
            success: false,
            message: 'Bình luận không được vượt quá 200 ký tự'
        });
    }
    next();
};

//middleware validate image
export const validateImageProfile = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng upload ảnh'
        });
    }
    next();
};


