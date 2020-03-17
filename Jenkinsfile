pipeline {
    agent none
    stages {
        stage ("Build & Tests"){
            agent {
                        docker {
                            image 'node:12-slim'
                        }
                    }
            stages {
                stage('Configuration') {
                    steps {
                        sh 'yarn install'
                    }
                }
                stage('Test') { 
                    steps {
                        sh 'yarn test-ci' 
                    }
                                post {
                                    always {
                                        step([$class: 'CoberturaPublisher', coberturaReportFile: 'output/coverage/jest/cobertura-coverage.xml'])
                                        junit 'output/report/junit/junit.xml'
                                    }
                                }
                }
            }
        }
        stage('Publish Docker Image for development') {
            agent any
                    steps {
                        script {
                            checkout scm
                            app = docker.build("ytalopigeon/node-ms-boilerplate:development")
                            docker.withRegistry('', 'docker-hub-credentials') {
                                app.push("latest")
                            }
                        }
                    }
                }
    }
}