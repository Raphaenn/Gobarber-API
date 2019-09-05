import mongoose, { Aggregate } from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    }
},
    {
    timestamps: true, // gravar datas de criação automaticamente
    }
);

export default mongoose.model("Notification", NotificationSchema);