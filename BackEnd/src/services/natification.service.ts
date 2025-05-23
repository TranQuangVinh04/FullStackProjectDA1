import mongoose from "mongoose";
import DatabaseNatification from "../model/notification.model";
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
    private createUniqueIdentifier(senderId: string, recipientId: string, type: string) {
        return `${senderId}_${recipientId}_${type}`;
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
        
      const uniqueIdentifier = this.createUniqueIdentifier(
        data.from.toString(),
        data.to.toString(),
        data.type,
       
      );
  
      const notification = await DatabaseNatification.findOneAndUpdate(
        { uniqueIdentifier },
        {
          from: data.from,
          to: data.to,
          type: data.type,
          uniqueIdentifier
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
  
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
        const notification = await DatabaseNatification.findByIdAndUpdate(data.id, {read:true});
        return {success:true,message:"Đã Đọc Thông Báo",data:notification};
    }

}
export const natificationService = NatificationService.getInstance();