class Event {
	events: { [key: string]: (...args: any[]) => void } = {};

	add(name: string, e: (...args: any[]) => void): string {
		this.events[name] = e;
		return name;
	}

	remove(name: string) {
		delete this.events[name];
	}

	emit(name: string, ...args: any[]) {
		this.events[name] && this.events[name](...args);
	}
}

export default new Event();
