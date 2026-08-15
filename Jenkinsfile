pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '888578135590'

        ECR_REPOSITORY = 'devops-capstone-nodejs'
        IMAGE_NAME = 'my-node-app'

        ECS_CLUSTER = 'devops-capstone-cluster'
        ECS_SERVICE = 'devops-capstone-task-service-7euhm4vv'

        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_IMAGE = "${ECR_REGISTRY}/${ECR_REPOSITORY}:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Test Docker Image') {
            steps {
                sh 'docker run --rm ${IMAGE_NAME}:latest node --version'
                sh 'docker run --rm ${IMAGE_NAME}:latest npm --version'
            }
        }

        stage('Login to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        docker run --rm \
                          -e AWS_ACCESS_KEY_ID \
                          -e AWS_SECRET_ACCESS_KEY \
                          amazon/aws-cli ecr get-login-password \
                          --region ${AWS_REGION} | \
                        docker login \
                          --username AWS \
                          --password-stdin ${ECR_REGISTRY}
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh 'docker tag ${IMAGE_NAME}:latest ${ECR_IMAGE}'
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh 'docker push ${ECR_IMAGE}'
            }
        }

        stage('Deploy to ECS') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        docker run --rm \
                          -e AWS_ACCESS_KEY_ID \
                          -e AWS_SECRET_ACCESS_KEY \
                          amazon/aws-cli ecs update-service \
                          --cluster ${ECS_CLUSTER} \
                          --service ${ECS_SERVICE} \
                          --force-new-deployment \
                          --region ${AWS_REGION}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                docker logout ${ECR_REGISTRY} || true
            '''
        }

        success {
            echo 'CI/CD pipeline completed successfully!'
            echo 'Docker image pushed to ECR and ECS deployment triggered.'
        }

        failure {
            echo 'Pipeline failed. Check the failed stage for the error.'
        }
    }
}

