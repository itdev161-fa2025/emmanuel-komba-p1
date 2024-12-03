import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import List from './models/List';

const app = express();

connectDatabase();

app.use(express.json({ extended: false }));

// API endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

/**
 * @route GET /api/list
 * @desc Get all list items
 */
app.get('/api/list', async (req, res) => {
    try {
        const listItems = await List.find();
        res.json(listItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route POST api/list
 * @desc Create a new list item
 */
app.post(
    '/api/list',
    [
        check('title', 'Please enter the title').not().isEmpty(),
        check('item', 'Please enter a valid item').not().isEmpty(),
        check('check', 'Please specify if the item is done').isBoolean()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const { title, item, check } = req.body;
        try {
            const newListItem = new List({ title, item, check });
            await newListItem.save();
            res.status(201).json(newListItem); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route PUT api/list/:id
 * @desc Update check status of a list item
 */
app.put('/api/list/:id', async (req, res) => {
    const { check } = req.body;
    try {
        let listItem = await List.findById(req.params.id);

        if (!listItem) {
            return res.status(404).json({ msg: 'List item not found' });
        }

        // Update check status
        listItem.check = check;

        await listItem.save();
        res.json(listItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Connection listener
app.listen(3000, () => console.log(`Express server running on port 3000`));
