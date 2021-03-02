import threading
import asyncio
from concurrent.futures import ThreadPoolExecutor
import Area

@singleton()
class AreaManager(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.setDaemon(True)
        self.areas = []
        self.ilock = threading.Lock()
        self.eventLoop = asyncio.new_event_loop()
        print("Area Manager started")
    
    def append(self, area):
        self.ilock.acquire()
        self.areas.append(area)
        self.ilock.release()
        print('Append new area %s' % area.getUUID())
    
    def remove(self, uuid):
        print('Remove area %s' % uuid)
        self.ilock.acquire()
        self.areas = [i for i in self.areas if i.getUUID() != uuid]
        self.ilock.release()

    def run(self):
        with ThreadPoolExecutor(max_workers=16) as executor:
            while True:
                futures = []
                self.ilock.acquire()
                for area in self.areas:
                    futures.append(executor.submit(Area.trigger, area))
                self.ilock.release()
                for task in futures:
                    try:
                        task.result(timeout=10)
                    except:
                        pass

