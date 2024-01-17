require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();

app.use(cors());

app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.ORG_KEY
});

app.post('/', async (req, res) => {
    try {
        const { userMessage } = req.body;
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Dado que eres un experto en material legal laboral en Chile..."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
        });

        if (completion && completion.choices && completion.choices.length > 0) {
            const message = completion.choices[0].message.content;
            res.json({ messages: [{ text: message }] });
        } else {
            // Si la respuesta de OpenAI no contiene los datos esperados
            res.status(500).json({ error: 'Respuesta inesperada de OpenAI' });
        }
    } catch (error) {
        console.error(error);
        // Asegurarse de enviar un JSON incluso en caso de error
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
