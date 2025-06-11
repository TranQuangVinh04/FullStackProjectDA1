import mongoose from "mongoose";
import DatabaseNatification from "../model/notification.model";
import { getReceiverSocketId, io } from "../config/socketIo";
interface CreateNotificationParams {
    from: mongoose.Types.ObjectId;
    to: mongoose.Types.ObjectId;
    type: string;
    uniqueIdentifier: string;
}
class NatificationService {
    private static instance: NatificationService;

    private constructor() {}

    public static getInstance(): NatificationService {
        if (!NatificationService.instance) {
            NatificationService.instance = new NatificationService();
        }
        return NatificationService.instance;
    }

   
      public async createManyNotification(data: CreateNotificationParams[]): Promise<mongoose.mongo.BulkWriteResult> {
        const bulkOps = data.map((item) => ({
          updateOne: {
            filter: { uniqueIdentifier: item.uniqueIdentifier },
            update: {
              $set: { 
                from: item.from,
                to: item.to,
                type: item.type,
                uniqueIdentifier: item.uniqueIdentifier,
              },
            },
            upsert: true,
          },
        }));
      
        const result = await DatabaseNatification.bulkWrite(bulkOps);
        return result;
      }
    
    public async createNotification(data: CreateNotificationParams) {
        
    
  
      const notification = await DatabaseNatification.findOneAndUpdate(
        { uniqueIdentifier:data.uniqueIdentifier },
        {
          from: data.from,
          to: data.to,
          type: data.type,
          uniqueIdentifier:data.uniqueIdentifier
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
      const receiverSocketId = getReceiverSocketId(data.to.toString());
      if(receiverSocketId ){
        io.to(receiverSocketId).emit("newNotification", notification);
      }
      return notification;
    }
    public async getNotification(data: {user:mongoose.Types.ObjectId}) {
        const notification = await DatabaseNatification.find({
            to: data.user
        });
        return notification;
    }
    public async deleteNotification(data: {id:mongoose.Types.ObjectId}) {
        const notification = await DatabaseNatification.findByIdAndDelete(data.id);
        return notification;
    }
    public async readNotification(data: {id:mongoose.Types.ObjectId}) {
        const notification = await DatabaseNatification.updateMany({to:data.id}, {read:true});
        return {success:true,message:"Đã Đọc Thông Báo"};
    }

}
export const natificationService = NatificationService.getInstance();