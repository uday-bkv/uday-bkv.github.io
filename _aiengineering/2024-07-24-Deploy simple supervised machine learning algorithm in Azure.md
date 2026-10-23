---
title: 'Deploy a simple supervised machine learning algorithm in Azure as a function.'
date: 2024-05-31
permalink: posts/2024/05/31/blog-post-1/
collection: posts
tags:
  - ML
  - Azure Function
  - Containerization
---


This post outlines the development of a supervised machine learning model using the DecisionTreeClassifier algorithm. We will cover training the model on a specific dataset, fine-tuning its parameters, and evaluating accuracy. After achieving proficiency, we'll deploy the model as an Azure Function for serverless execution and expose it as a REST API for real-time predictions. This approach offers insights into machine learning and cloud-based solutions.

Note:Azure provides machine learning services through Azure ML Designer, which is a visual drag-and-drop interface for building and deploying machine learning pipelines, and Azure ML SDK, which allows for programmatic control and customization.


## 🚀 Features

- **Machine Learning Model**: DecisionTreeClassifier trained on the famous Iris dataset
- **REST API**: FastAPI-powered endpoints with automatic documentation
- **Cloud Deployment**: Serverless deployment on Azure Functions
- **Containerization**: Docker support for consistent environments


## 🏃‍♂️ Quick Start

### Prerequisites

- Python 3.8+
- pip or conda
- Docker (optional)
- Azure CLI (for Azure deployment)

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uday-bkv/ml-model-as-rest-api
   cd ml-model-deployment
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the application**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc
## 🌺 Dataset Information

**Iris Dataset** from scikit-learn:
- **Samples**: 150
- **Features**: 4 (sepal length, sepal width, petal length, petal width)
- **Classes**: 3 (Setosa, Versicolor, Virginica)
- **Type**: Multiclass classification

The dataset is automatically loaded and preprocessed when training the model.

## 📁 Project Structure

```
ml-model-deployment/
├── main.py                 # FastAPI application
├── model/
│   ├── __init__.py
│   ├── train.py           # Model training script
│   └── iris_model.joblib  # Trained model file
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
└── README.md           # This file
```



## 🧪 Testing

### Manual Testing

Use the provided examples in the interactive documentation or test with curl:

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "sepal_length": 6.3,
  "sepal_width": 2.5,
  "petal_length": 5.0,
  "petal_width": 1.9
}'
```


## 📊 Model Performance

- **Accuracy**: ~96% on test set
- **Training Time**: < 1 second
- **Prediction Time**: < 10ms per request
- **Model Size**: ~2KB




## 📚 API Documentation

### Endpoints

#### `POST /predict`
Predict the Iris species based on flower measurements.

**Request Body:**
```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

**Response:**
```json
{
  "prediction": "setosa",
  "confidence": 0.95,
  "all_probabilities": {
    "setosa": 0.95,
    "versicolor": 0.03,
    "virginica": 0.02
  }
}
```


## 🐳 Docker Deployment


```bash
docker run -p 8000:8000 venmaum/ml-simple-app
```
## ☁️ Azure Functions Deployment

### Prerequisites

- Azure CLI installed and configured
- Azure Functions Core Tools

### Deployment Steps

1. **Login to Azure**
   ```bash
   az login
   ```

2. **Create Resource Group**
   ```bash
   az group create --name ml-app-rg --location eastus
   ```

3. **Deploy Function App**
   ```bash
   func azure functionapp publish <function-app-name>
   ```

4. **Test the deployed function**
   ```bash
   curl -X POST https://<function-app-name>.azurewebsites.net/api/predict \
   -H "Content-Type: application/json" \
   -d '{"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2}'
   ```



## 📚 References

- [Scikit-learn Decision Trees](https://scikit-learn.org/stable/modules/tree.html)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Azure Functions Python Guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-python)
- [Source Code](https://github.com/uday-bkv/ml-model-as-rest-api)

## 🏷️ Tags

`machine-learning` `fastapi` `azure-functions` `docker` `iris-dataset` `decision-tree` `rest-api` `python` `scikit-learn`