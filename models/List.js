import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    check: {
        type: Boolean,
        required: true
    }
});

const List = mongoose.model('List', ListSchema);

export default List;
