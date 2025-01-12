"""
Mind Monitor - OSC Receiver Audio Feedback
Coded: James Clutterbuck (2021)
Requires: python-osc, math, playsound, matplotlib, threading
"""
from pythonosc import dispatcher
from pythonosc import osc_server
import math
from playsound import playsound
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import threading

#Muse Variables
hsi = [4,4,4,4]
hsi_string = ""
abs_waves = [-1,-1,-1,-1,-1]
rel_waves = [-1,-1,-1,-1,-1]


#Plot Array
plot_val_count = 200
plot_data = [[0],[0],[0],[0],[0]]


#Live plot
def update_plot_vars(wave):
    global plot_data, rel_waves, plot_val_count
    plot_data[wave].append(rel_waves[wave])
    plot_data[wave] = plot_data[wave][-plot_val_count:]

def plot_update(i):
    global plot_data
    global alpha_sound_threshold
    if len(plot_data[0])<10:
        return
    plt.cla()
    for wave in [0,1,2,3,4]:
        if (wave==0):
            colorStr = 'red'
            waveLabel = 'Delta'
        if (wave==1):
            colorStr = 'purple'
            waveLabel = 'Theta'
        if (wave==2):
            colorStr = 'blue'
            waveLabel = 'Alpha'
        if (wave==3):
            colorStr = 'green'
            waveLabel = 'Beta'
        if (wave==4):
            colorStr = 'orange'
            waveLabel = 'Gamma'
        plt.plot(range(len(plot_data[wave])), plot_data[wave], color=colorStr, label=waveLabel+" {:.4f}".format(plot_data[wave][len(plot_data[wave])-1]))        
        
    plt.plot([0,len(plot_data[0])],[alpha_sound_threshold,alpha_sound_threshold],color='black', label='Alpha Sound Threshold',linestyle='dashed')
    plt.ylim([0,1])
    plt.xticks([])
    plt.title('Mind Monitor - Relative Waves')
    plt.legend(loc='upper left')
    

#Main
if __name__ == "__main__":
    #Tread for plot render - Note this generates a warning, but works fine
    thread = threading.Thread(target=init_plot)
    thread.daemon = True
    thread.start()
    
    #Init Muse Listeners    
    dispatcher = dispatcher.Dispatcher()
    dispatcher.map("/muse/elements/horseshoe", hsi_handler)
    
    dispatcher.map("/muse/elements/delta_absolute", abs_handler,0)
    dispatcher.map("/muse/elements/theta_absolute", abs_handler,1)
    dispatcher.map("/muse/elements/alpha_absolute", abs_handler,2)
    dispatcher.map("/muse/elements/beta_absolute", abs_handler,3)
    dispatcher.map("/muse/elements/gamma_absolute", abs_handler,4)

    server = osc_server.ThreadingOSCUDPServer((ip, port), dispatcher)
    print("Listening on UDP port "+str(port))
    server.serve_forever()