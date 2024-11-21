import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { DynamoDBClient, ScanCommand, PutItemCommand, GetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize DynamoDB client
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIAYUQGS2PRB27VVMUF',
        secretAccessKey: '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',
    },
});

// Delete a document
app.delete('/documents/:id', async (req, res) => {
    const { id } = req.params; // Extract the document ID from the URL parameter
    console.log("Delete request received for ID:", id);

    try {
        // Define the key of the document to be deleted
        const deleteItemCommand = new DeleteItemCommand({
            TableName: 'legal-doc',
            Key: {
                _id: { S: id }, 
            },
        });

        // Send the delete command to DynamoDB
        await client.send(deleteItemCommand);
        console.log(`Document with ID ${id} deleted successfully`);
        res.status(200).send(`Document with ID ${id} deleted successfully`);
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).send('Error deleting document');
    }
});
  

// Updating a specific doc
app.put('/documents/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const marshalledItem = marshall(updatedData);
        const updateItemCommand = new PutItemCommand({
            TableName: 'legal-doc',
            Item: marshalledItem,
        });

        await client.send(updateItemCommand);
        res.status(200).send('Document updated successfully');
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).send('Error updating document');
    }
});


/// get a specific item 
app.get('/documents/:id', async (req, res) => {
    const id = req.params.id;
    console.log('Received ID:', id); // Log the received ID

    try {
        // Marshal the key for DynamoDB
        const marshalledKey = marshall({ _id: id }); 
        console.log('Marshalled Key:', marshalledKey);
 
        // Create and send the GetItemCommand
        const getItemCommand = new GetItemCommand({
            TableName: 'legal-doc',
            Key: marshalledKey,
        });

        const result = await client.send(getItemCommand);

        if (result.Item) {
            const item = unmarshall(result.Item); // Convert the result to plain JSON
            //console.log('Fetched Item:', item);
            res.json(item);
        } else {
            console.log(`Item not found for ID: ${id}`);
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error('Error fetching item:', error.message);
        res.status(500).json({ message: 'Error fetching item', error: error.message });
    }
});



// API Endpoint: Get all items from DynamoDB
app.get('/documents', async (req, res) => {
    try {
        const scanCommand = new ScanCommand({
            TableName: 'legal-doc',
        });

        const result = await client.send(scanCommand);
        const items = result.Items.map((item) => unmarshall(item));

        res.json(items);
    } catch (error) {
        console.error('Error retrieving items:', error);
        res.status(500).send('Error retrieving items');
    }
});

// API Endpoint: Add a new item to DynamoDB
app.post('/documents', async (req, res) => {
    const newItem = req.body;

    try {
        const marshalledItem = marshall(newItem);
        const putItemCommand = new PutItemCommand({
            TableName: 'legal-doc',
            Item: marshalledItem,
        });

        await client.send(putItemCommand);
        res.status(201).send('Item added successfully');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Error adding item');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
