import threading
from singleton import singleton

@singleton()
class AreaManager(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.setDaemon(True)
        self.areas = []
        self.ilock = threading.Lock()
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
        while True:
            self.ilock.acquire()
            for area in self.areas:
                area.trigger()
            self.ilock.release()

