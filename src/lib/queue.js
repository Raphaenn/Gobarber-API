import Bee from "bee-queue";
import CancellationMail from "../app/jobs/CancellationMail"
import redisConfig from "../config/redis";

// toda vez que tivermos uma novo job salvaremos nesse vetor
const jobs = [CancellationMail];

class Queue {
    constructor() {

        // Cada metodo vai ter sua fila
        this.queues = {};

        this.init();
    }

    init() {

        // percorrer jobs
        jobs.forEach(({key, handle}) => {
            this.queues[key] = {
               bee: new Bee(key, {
                redis: redisConfig,
            }),
            handle, 
            }
        })
    }

    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    processQueue() {
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    // tratativas de erro na fila.
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err)
    }

}

export default new Queue();

// Jobs são nos novos models nesse tipo de banco
// pegamos todos os jobs e armezanamos no queues