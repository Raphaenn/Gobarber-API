/* Arquivo para executar em segundo plano de forma independente do processo principal*/
import "dotenv/config";
import Queue from "./lib/queue";

Queue.processQueue();