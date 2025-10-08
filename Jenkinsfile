pipeline {
    agent { label 'Jenkins' }

    environment {
        IMAGE_NAME = 'kanupriya1801/todo-app'
        IMAGE_TAG = "${env.GIT_COMMIT}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        echo $PASSWORD | docker login -u $USERNAME --password-stdin
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                        docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}
