import datetime
from math import trunc


class Stopwatch:
    creation_time = None
    start_time = 0
    elapsed_time = 0

    def __init__(self):
        self.creation_time = datetime.datetime.now()
        self.start_time = trunc(self.creation_time.timestamp() * 1000)
        self.elapsed_time = 0

    def stop_stopwatch(self):
        self.elapsed_time = trunc(datetime.datetime.now().timestamp() * 1000 - self.start_time)
        return self.elapsed_time
