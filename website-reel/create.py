from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random, os
random.seed(8)
W,H=1080,1920
out='website-reel'
reg='C:/Windows/Fonts/arial.ttf'; bold='C:/Windows/Fonts/arialbd.ttf'
def f(n,b=False): return ImageFont.truetype(bold if b else reg,n)
def bg():
 im=Image.new('RGB',(W,H)); px=im.load()
 for y in range(H):
  for x in range(W):
   light=math.exp(-(((x-880)/750)**2+((y-760)/800)**2)*2)
   px[x,y]=(int(5+29*light),int(13+65*light),int(10+35*light))
 d=ImageDraw.Draw(im,'RGBA')
 for i in range(-8,16):
  d.line([(i*160-300,0),(i*230-600,H)],fill=(155,213,142,35),width=2)
 for j in range(12):
  yy=100+j*185
  d.line([(0,yy),(W,yy-115)],fill=(155,213,142,26),width=2)
 for i in range(110):
  x=random.randrange(W);y=random.randrange(H); rr=random.choice([1,2,3]);d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(208,255,185,95))
 return im.convert('RGBA')
def label(d,t,y):
 d.rounded_rectangle((80,y,80+int(d.textlength(t,font=f(20,True)))+36,y+50),radius=3,fill='#a9d875'); d.text((98,y+13),t,font=f(20,True),fill='#10200e')
def lines(d,text,y,size=79):
 for i,line in enumerate(text):d.text((80,y+i*(size+14)),line,font=f(size,True),fill='#f4f9ef',stroke_width=0)
def pill(d,text,y):
 d.rounded_rectangle((80,y,1000,y+72),radius=3,outline=(184,225,157,120),width=2);d.text((102,y+22),text,font=f(24,True),fill='#c9eeb1')
def phone(im,path,box,crop=None):
 source=Image.open(path).convert('RGB')
 if crop: source=source.crop(crop)
 x,y,w,h=box
 source=source.resize((w,h),Image.Resampling.LANCZOS)
 mask=Image.new('L',(w,h));ImageDraw.Draw(mask).rounded_rectangle((0,0,w,h),radius=26,fill=255)
 shadow=Image.new('RGBA',im.size);sd=ImageDraw.Draw(shadow);sd.rounded_rectangle((x-4,y+10,x+w+18,y+h+26),radius=32,fill=(0,0,0,190));shadow=shadow.filter(ImageFilter.GaussianBlur(24));im.alpha_composite(shadow)
 im.paste(source,(x,y),mask);d=ImageDraw.Draw(im);d.rounded_rectangle((x-5,y-5,x+w+5,y+h+5),radius=29,outline='#d5edd0',width=6)
def finish(im,i):
 d=ImageDraw.Draw(im);d.line((80,1803,1000,1803),fill=(209,241,193,70),width=2);d.text((80,1834),'GTSYSTEMS  /  DIGITAL EXPERIENCE',font=f(20,True),fill='#c5dbbd');d.text((915,1834),f'0{i} / 05',font=f(18),fill='#c5dbbd');im.convert('RGB').save(f'{out}/scene{i}.jpg',quality=95)
temp=os.environ['TEMP']
a=os.path.join(temp,'codex-clipboard-034797d9-d26f-4683-8715-f03757452b0a.png')
b=os.path.join(temp,'codex-clipboard-34b20790-ac24-495c-841e-183790910aa5.png')
im=bg();d=ImageDraw.Draw(im);label(d,'NEW DIGITAL EXPERIENCE',105);lines(d,['Νέα εποχή.','Νέα εμπειρία.'],205,83);d.text((84,425),'Γνώρισε το νέο μας website.',font=f(32),fill='#bfd3b9');phone(im,a,(275,550,530,943),(207,59,583,727));d=ImageDraw.Draw(im);pill(d,'ΣΥΝΔΕΟΥΜΕ  ·  ΔΗΜΙΟΥΡΓΟΥΜΕ',1580);finish(im,1)
im=bg();d=ImageDraw.Draw(im);label(d,'DESIGN IN MOTION',105);lines(d,['Σχεδιασμός','που κινείται.'],205,76);d.text((82,405),'Μια νέα ψηφιακή εμπειρία',font=f(33),fill='#c5d6bd');d.text((82,455),'σε κάθε οθόνη.',font=f(33),fill='#c5d6bd');phone(im,a,(275,560,530,943),(207,59,583,727));d=ImageDraw.Draw(im);pill(d,'3D ΑΙΣΘΗΣΗ  ·  ΔΙΑΔΡΑΣΤΙΚΗ ΚΙΝΗΣΗ',1580);finish(im,2)
im=bg();d=ImageDraw.Draw(im);label(d,'EXPLORE THE EXPERIENCE',105);lines(d,['Ανακάλυψε','τις δυνατότητες.'],205,68);d.text((82,398),'AI, web και ψηφιακά συστήματα',font=f(31),fill='#c5d6bd');phone(im,b,(275,510,530,1026),(200,67,598,838));d=ImageDraw.Draw(im);pill(d,'ΜΙΑ ΕΜΠΕΙΡΙΑ ΠΟΥ ΕΞΕΛΙΣΣΕΤΑΙ',1590);finish(im,3)
im=bg();d=ImageDraw.Draw(im);label(d,'OUR WORK',105);lines(d,['Οι ιδέες μας.','Τα έργα μας.'],205,76);d.text((82,410),'Ανακάλυψε το portfolio μας.',font=f(31),fill='#c5d6bd');phone(im,'public/portfolio-mobile-v3/01.jpg',(105,620,360,700));phone(im,'public/portfolio-mobile-v3/02.jpg',(350,535,380,740));phone(im,'public/portfolio-mobile-v3/03.jpg',(625,660,350,680));d=ImageDraw.Draw(im);pill(d,'WEBSITES  ·  APPLICATIONS  ·  DIGITAL',1530);finish(im,4)
im=bg();d=ImageDraw.Draw(im);label(d,'WELCOME TO THE NEW',160);lines(d,['Το νέο μας site','είναι εδώ.'],285,76);d.text((83,520),'Σχεδιάζουμε το επόμενο βήμα',font=f(34),fill='#c5d6bd');d.text((83,568),'της ψηφιακής σου παρουσίας.',font=f(34),fill='#c5d6bd');phone(im,a,(325,700,430,765),(207,59,583,727));d=ImageDraw.Draw(im);d.rounded_rectangle((80,1540,1000,1660),radius=4,fill='#a9d875');d.text((135,1577),'digital.gtsystems.gr',font=f(44,True),fill='#10200e');finish(im,5)


