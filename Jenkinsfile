pipeline {
    agent {label 'built-in'}

    environment {
        DOCKER_IMAGE = "kanupriya18/todo-2.0"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        KUBECONFIG = "/root/.kube/config"
        SONAR_PROJECT_KEY = 'todo-2.0'
        SONARQUBE_TOKEN = credentials('MySonarQubeServer') 
        SONAR_HOST_URL = 'http://localhost:9000'
        HELM_RELEASE = 'todo-app'
        CHART_PATH = './todo-chart'
        OPENSHIFT_NAMESPACE = 'kanupriya1801-dev'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/kanupriya1801/Todo-2.0.git', branch: 'main'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube-Server') {
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                                -Dsonar.sources=. \
                                -Dsonar.projectVersion=${DOCKER_TAG} \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.login=${SONARQUBE_TOKEN}
                        '''
                    }
                }
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
                    helm upgrade --install todo-app ./todo-chart \
                      --set image.repository=${DOCKER_IMAGE} \
                      --set image.tag=${DOCKER_TAG} \
                      --kubeconfig=${env.KUBECONFIG}
                """
            }
        }
        stage('Deploy to OpenShift') {
            steps {
                echo " Deploying ${DOCKER_IMAGE}:${DOCKER_TAG} to OpenShift"
                sh '''
                   helm upgrade --install ${HELM_RELEASE} ${CHART_PATH} \
                   --namespace ${OPENSHIFT_NAMESPACE} \
                   --set image.repository=${DOCKER_IMAGE} \
                   --set image.tag=${DOCKER_TAG}
               '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                    oc get pods -n ${OPENSHIFT_NAMESPACE}
                    oc get svc -n ${OPENSHIFT_NAMESPACE}
                """
            }
        }
        stage('Update Jira') {
            steps {
                sh """
                  curl -X POST https://kanupriya18701-1758796370320.atlassian.net/rest/builds/0.1/bulk \\
                    -u                                                                                                                                                                      kanupriya18701@gmail.com:ATATT3xFfGF06B2CRm4bFUPELT65fWEwNmGh_dlTlEAKBtpx1DsP_KB37btlUruKHF7O67EvS3qaxOHtj-w9sXscRzfQSm8dZj-DLTesLyDsTwteEl4JhfbOp-wCv9uoYakm25qxo1rfkZ4X7GVOMnKizjYSAs8Kjq8SRlX0LeiorD9_jFbNseA \\
                       -H 'Content-Type: application/json' \\
                       -d '{
                         "builds": [{
                           "pipelineId": "todo-app",
                           "buildNumber": "${env.BUILD_NUMBER}",
                           "updateSequenceNumber": ${env.BUILD_NUMBER},
                           "displayName": "Build #${env.BUILD_NUMBER}",
                           "url": "http://localhost:8080/job/Todo-app/${env.BUILD_NUMBER}/",
                           "state": "successful",
                           "issueKeys": ["SCRUM-7"]
                         }]
                      }'
                 """
            }
        }
    }
}
