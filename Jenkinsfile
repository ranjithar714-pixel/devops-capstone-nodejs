pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-node-app:latest .'
            }
        }

        stage('Test Docker Image') {
            steps {
                sh 'docker run --rm my-node-app:latest node --version'
                sh 'docker run --rm my-node-app:latest npm --version'
            }
        }
    }
}