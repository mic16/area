import threading
from singleton import singleton
import asyncio

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

    async def _exec(area):
        area.trigger()

    def run(self):
        while True:
            asyncio.set_event_loop(self.eventLoop)
            futures = []
            self.ilock.acquire()
            for area in self.areas:
                futures.append(asyncio.create_task(_exec(area.trigger())))
            self.ilock.release()
            self.eventLoop.run_until_complete(asyncio.gather(*futures))

