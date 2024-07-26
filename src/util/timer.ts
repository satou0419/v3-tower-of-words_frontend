export class Timer {
    private startTime: number | null = null;
    private stopTime: number | null = null;
    private running: boolean = false;
    private totalTime: number = 0;
    private fullStartTime: number | null = null;
    private fullStopTime: number | null = null;
    private fullStopTriggered: boolean = false;
    private lastRecordTime: number = 0;

    start() {
        if (this.fullStopTriggered) return;
        if (!this.running) {
            this.startTime = Date.now();
            this.running = true;
            if (this.fullStartTime === null) {
                this.fullStartTime = this.startTime;
            }
            this.stopTime = null;
        }
    }

    stop() {
        if (this.fullStopTriggered) return;
        if (this.running) {
            this.stopTime = Date.now();
            this.totalTime += this.stopTime - this.startTime!;
            this.running = false;
        }
    }

    reset() {
        if (this.fullStopTriggered) return;
        if (this.running) {
            this.totalTime += Date.now() - this.startTime!;
        }
        this.lastRecordTime = this.getTime();
        this.startTime = null;
        this.stopTime = null;
        this.running = false;
    }

    getTime(): number {
        if (this.fullStopTriggered) return 0;
        if (this.startTime === null) {
            return 0;
        }
        if (this.running) {
            return Date.now() - this.startTime;
        }
        if (this.stopTime !== null) {
            return this.stopTime - this.startTime;
        }
        return 0;
    }

    getTotalTime(): number {
        if (this.fullStopTriggered) return this.totalTime;
        if (this.running) {
            return this.totalTime + (Date.now() - this.startTime!);
        }
        return this.totalTime;
    }

    getFormattedTime(): string {
        const time = this.getTime();
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;

        return formattedTime;
    }

    getFormattedTotalTime(): string {
        const time = this.getTotalTime();
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;

        return formattedTime;
    }

    getFormattedLastRecordTime(): string {
        const time = this.lastRecordTime;
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;

        return formattedTime;
    }

    fullstop() {
        if (this.fullStopTriggered) return;
        this.fullStopTriggered = true;
        if (this.fullStartTime !== null && this.fullStopTime === null) {
            this.fullStopTime = Date.now();
        }
    }

    getFullTime(): number {
        if (this.fullStopTriggered && this.fullStopTime !== null) {
            return this.fullStopTime - this.fullStartTime!;
        }
        if (this.fullStartTime === null) {
            return 0;
        }
        return Date.now() - this.fullStartTime;
    }

    getFormattedFullTime(): string {
        const time = this.getFullTime();
        const milliseconds = time % 1000;
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;

        return formattedTime;
    }
}
