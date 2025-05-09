import mongoose from "mongoose";
import DatabaseNatification from "../model/notification";

const createUniqueIdentifier = (senderId: string, recipientId: string, type: string) => {
    return `${senderId}_${recipientId}_${type}`;
  }
  

  export const createNotification = async (data: {
    from: mongoose.Types.ObjectId,
    to: mongoose.Types.ObjectId, 
    type: string,
    
  }) => {
  
      const uniqueIdentifier = createUniqueIdentifier(
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