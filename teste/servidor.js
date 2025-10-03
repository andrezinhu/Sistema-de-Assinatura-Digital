// server.js
const express = require('express');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const app = express();
app.use(express.json({ limit: '10mb' })); // para aceitar base64 grande

// endpoint que recebe a assinatura
app.post('/api/sign', async (req, res) => {
    try {
        const { documentId, page, relX, relY, relW, relH, sigImage } = req.body;

        // carregar PDF original do disco (ou banco)
        // aqui só exemplo fixo
        const pdfBytes = fs.readFileSync('contracheque.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // converter base64 para buffer
        const pngBase64 = sigImage.split(',')[1];
        const pngBytes = Buffer.from(pngBase64, 'base64');
        const pngImage = await pdfDoc.embedPng(pngBytes);

        // pegar página
        const pdfPage = pdfDoc.getPages()[page - 1];
        const { width, height } = pdfPage.getSize();

        // converter coordenadas relativas em pontos absolutos
        const x = relX * width;
        const y = height - (relY * height) - (relH * height); // ajustar para coordenada do PDF (origem em baixo-esquerda)
        const w = relW * width;
        const h = relH * height;

        pdfPage.drawImage(pngImage, { x, y, width: w, height: h });

        // salvar novo PDF
        const signedPdfBytes = await pdfDoc.save();
        const signedPath = `signed-${Date.now()}.pdf`;
        fs.writeFileSync(signedPath, signedPdfBytes);

        return res.json({ signedUrl: signedPath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao assinar PDF' });
    }
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
