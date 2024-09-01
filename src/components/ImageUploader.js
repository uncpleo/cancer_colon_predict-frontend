import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';  // Crear un archivo CSS para estilos

function ImageUploader() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setPrediction(null); // Limpiar la predicción anterior al seleccionar un nuevo archivo
        
        // Mostrar la vista previa de la imagen seleccionada
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
        setPrediction(null);
        
        // Mostrar la vista previa de la imagen seleccionada
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPrediction(response.data);
        } catch (error) {
            console.error('Error uploading the file', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="uploader-container">
            <div 
                className="drop-area" 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Selected preview" className="image-preview" />
                ) : (
                    <p>Drag and drop an image, or click to select</p>
                )}
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input" 
                />
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <p>Loading...</p>
                </div>
            ) : (
                <button onClick={handleSubmit} className="upload-button">
                    Upload
                </button>
            )}

            {prediction && (
                <div className="prediction-result">
                    <p>Label: {prediction.label}</p>
                    <p>Confidence: {prediction.confidence.toFixed(4)}</p>
                </div>
            )}
        </div>
    );
}

export default ImageUploader;


