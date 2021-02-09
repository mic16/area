import sys
import os
import importlib
sys.path.append('./tools/')

sys.path.append('./service/')
sys.path.append('./types/')
sys.path.append('./storage/')
sys.path.append('./API/')
sys.path.append('./tests')

import pytest

import Area_test
import Config_test

pytest.diagnostic()

