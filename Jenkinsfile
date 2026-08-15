pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REGISTRY = '888578135590.dkr.ecr.ap-south-1.amazonaws.com'
        ECR_REPOSITORY = 'devops-capstone-nodejs'
        IMAGE_NAME = 'my-node-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm install'
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

        stage('Login to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        docker run --rm \
                          -e AWS_ACCESS_KEY_ID \
                          -e AWS_SECRET_ACCESS_KEY \
                          amazon/aws-cli \
                          ecr get-login-password \
                          --region ${AWS_REGION} |
                        docker login \
                          --username AWS \
                          --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                    docker tag \
                    ${IMAGE_NAME}:latest \
                    ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker push \
                    ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout ${ECR_REGISTRY} || true'
        }
    }
}