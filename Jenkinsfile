pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "kanupriya18/todo-2.0"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kanupriya1801/Todo-2.0.git', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-creds', url: '']) {
                    script {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes with Helm') {
            steps {
                sh """
                    helm upgrade --install todo-app ./todo-helm-chart \
                      --set image.repository=${DOCKER_IMAGE} \
                      --set image.tag=${DOCKER_TAG} \
                      --kubeconfig=${KUBECONFIG}
                """
            }
        }

        stage('Update Jira') {
            steps {
                jiraSendBuildInfo site: 'JiraSite', issueKey: 'SCRUM-123'
            }
        }
    }
}
