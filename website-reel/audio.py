import numpy as np, wave
sr=44100; duration=20; t=np.arange(sr*duration)/sr
sound=np.zeros_like(t); beat=60/110
for n in range(int(duration/beat)+1):
 s=int(n*beat*sr); length=min(int(.24*sr),len(t)-s)
 if length<=0: continue
 tt=np.arange(length)/sr
 sound[s:s+length]+=0.19*np.sin(2*np.pi*(65*tt+65*.04*(1-np.exp(-tt/.04))))*np.exp(-tt*19)
 for off in [0,.5]:
  k=s+int(off*beat*sr); l=min(int(.055*sr),len(t)-k)
  if l>0:
   rng=np.random.default_rng(n*2+int(off*2)); sound[k:k+l]+=0.025*rng.normal(0,1,l)*np.exp(-np.arange(l)/sr*90)
for n in range(int(duration/(beat*2))+1):
 s=int(n*beat*2*sr); l=min(int(beat*2*sr),len(t)-s)
 if l<=0: continue
 tt=np.arange(l)/sr; freq=[220,261.63,164.81,196][n%4]
 env=np.minimum(1,tt*5)*np.minimum(1,(l/sr-tt)*3)*.035
 sound[s:s+l]+=env*(np.sin(2*np.pi*freq*tt)+.4*np.sin(2*np.pi*freq*1.5*tt))
sound*=np.minimum(1,t*1.5)*np.minimum(1,(duration-t)*1.2)
with wave.open('website-reel/music.wav','wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(sound,-1,1)*32767).astype('<i2').tobytes())
