"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InvitationData } from "@/lib/initial-data";
<<<<<<< HEAD
import { PlusCircle, Trash2, Wand2, Loader2, Palette, Image as ImageIcon } from "lucide-react";
=======
import { PlusCircle, Trash2, Wand2, Loader2, Palette } from "lucide-react";
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { adaptInvitationContentAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type EditFormProps = {
  data: InvitationData;
  setData: (data: InvitationData) => void;
};

const themes = [
    { name: "default", label: "Classic Maroon", primary: "hsl(333 62% 19%)", accent: "hsl(46 65% 52%)" },
    { name: "theme-royal-blue", label: "Royal Blue", primary: "hsl(221 83% 30%)", accent: "hsl(45 100% 70%)" },
    { name: "theme-emerald-green", label: "Emerald Green", primary: "hsl(145 63% 20%)", accent: "hsl(95 53% 70%)" },
    { name: "theme-ruby-red", label: "Ruby Red", primary: "hsl(350 70% 35%)", accent: "hsl(20 100% 75%)" },
<<<<<<< HEAD
    { name: "theme-magenta-gold", label: "Vibrant Magenta", primary: "hsl(335 81% 32%)", accent: "hsl(45 86% 66%)" },
    { name: "theme-silver-moon", label: "Silver Moon", primary: "hsl(220 15% 25%)", accent: "hsl(210 30% 80%)" },
    { name: "theme-dark-green", label: "Dark Green", primary: "hsl(150 35% 30%)", accent: "hsl(50 50% 75%)" },
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f
];


export function EditForm({ data, setData }: EditFormProps) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ suggestedMessage: string; designAdjustments: string; } | null>(null);
<<<<<<< HEAD
  const [imageUrl, setImageUrl] = useState(data.coupleImageUrl || "");
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  
  const handleThemeChange = (value: string) => {
    setData({ ...data, theme: value });
  };

  const handleScheduleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSchedule = [...data.schedule];
    newSchedule[index] = { ...newSchedule[index], [name]: value };
    setData({ ...data, schedule: newSchedule });
  };

  const addScheduleItem = () => {
    setData({
      ...data,
      schedule: [...data.schedule, { name: "", details: "" }],
    });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = data.schedule.filter((_, i) => i !== index);
    setData({ ...data, schedule: newSchedule });
  };
  
  const handleAdaptContent = async () => {
    setIsAiLoading(true);
    try {
        const result = await adaptInvitationContentAction({
            brideName: data.brideName,
            groomName: data.groomName,
            mainDate: `${data.mainDay}, ${data.mainDate} ${data.mainYear}`,
            venueName: data.venueName,
            userPrompt: "कृपया एक पारंपरिक आणि सुंदर संदेश तयार करा."
        });
        if (result) {
            setAiSuggestions(result);
        } else {
            throw new Error("AI response was empty.");
        }
    } catch (error) {
        console.error("AI adaptation failed:", error);
        toast({
            variant: "destructive",
            title: "AI मदत अयशस्वी",
            description: "सामग्री जुळवून घेण्यात एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
        });
    } finally {
        setIsAiLoading(false);
    }
  };

  const applyAiSuggestion = (field: 'suggestedMessage' | 'designAdjustments') => {
      if (aiSuggestions) {
          setData({
              ...data,
              suggestedMessage: aiSuggestions.suggestedMessage,
              designAdjustments: aiSuggestions.designAdjustments,
          });
          toast({
              title: "AI सूचना लागू केली",
              description: "AI ने सुचवलेली सामग्री तुमच्या आमंत्रणात जोडली आहे.",
          });
          setAiSuggestions(null);
      }
  };

<<<<<<< HEAD
  const handleSetImage = () => {
    setData({ ...data, coupleImageUrl: imageUrl });
    toast({
      title: "Image URL Set",
      description: "The image will be updated in the preview. Remember to save your changes.",
    });
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setData({ ...data, coupleImageUrl: "" });
    toast({
      title: "Image Removed",
      description: "The custom image has been removed. The default will be shown.",
    });
  };
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 font-body">
      <div className="space-y-8">
        
        {/* Theme Selector */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <div className="flex items-center gap-4 mb-4">
            <Palette className="h-6 w-6 text-primary"/>
            <h2 className="text-2xl font-headline font-bold text-primary">थीम निवडा</h2>
          </div>
          <RadioGroup value={data.theme} onValueChange={handleThemeChange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themes.map((theme) => (
                 <Label key={theme.name} htmlFor={theme.name} className="flex flex-col items-center gap-2 border-2 rounded-lg p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                    <RadioGroupItem value={theme.name} id={theme.name} className="sr-only"/>
                    <div className="flex gap-1 w-full h-8 rounded-md overflow-hidden">
                       <div className="w-2/3 h-full" style={{backgroundColor: theme.primary}}></div>
                       <div className="w-1/3 h-full" style={{backgroundColor: theme.accent}}></div>
                    </div>
                    <span className="text-sm font-medium">{theme.label}</span>
                </Label>
              ))}
          </RadioGroup>
        </div>

<<<<<<< HEAD
        {/* Main Photo */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
            <div className="flex items-center gap-4 mb-4">
              <ImageIcon className="h-6 w-6 text-primary"/>
              <h2 className="text-2xl font-headline font-bold text-primary">मुख्य फोटो</h2>
            </div>
            <div className="space-y-2">
                <Label htmlFor="coupleImageUrl">फोटो URL</Label>
                <div className="flex items-center gap-2">
                    <Input id="coupleImageUrl" name="coupleImageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/your-photo.jpg" />
                    <Button onClick={handleSetImage}>Set Image</Button>
                    <Button variant="outline" onClick={handleRemoveImage}>Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground">तुमच्या जोडप्याच्या फोटोची URL येथे पेस्ट करा आणि 'Set Image' वर क्लिक करा. सर्वोत्तम परिणामांसाठी पारदर्शक पार्श्वभूमी असलेली प्रतिमा वापरा.</p>
            </div>
        </div>
=======
>>>>>>> dc8c8cad2180a258e377915c758104047d66109f

        {/* Main Details */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="md:col-span-2 text-2xl font-headline font-bold text-primary mb-4">वधू आणि वर तपशील</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary/90">वधू</h3>
              <div className="space-y-2">
                <Label htmlFor="brideName">वधूचे नाव</Label>
                <Input id="brideName" name="brideName" value={data.brideName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideFather">वधूचे वडील</Label>
                <Input id="brideFather" name="brideFather" value={data.brideFather} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brideMother">वधूची आई</Label>
                <Input id="brideMother" name="brideMother" value={data.brideMother} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary/90">वर</h3>
              <div className="space-y-2">
                <Label htmlFor="groomName">वराचे नाव</Label>
                <Input id="groomName" name="groomName" value={data.groomName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groomFather">वराचे वडील</Label>
                <Input id="groomFather" name="groomFather" value={data.groomFather} onChange={handleChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="groomMother">वराची आई</Label>
                <Input id="groomMother" name="groomMother" value={data.groomMother} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">तारीख आणि वेळ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="mainDate">तारीख (उदा. २६)</Label>
                  <Input id="mainDate" name="mainDate" value={data.mainDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="mainDay">दिवस</Label>
                  <Input id="mainDay" name="mainDay" value={data.mainDay} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="mainTime">वेळ</Label>
                  <Input id="mainTime" name="mainTime" value={data.mainTime} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="mainYear">वर्ष</Label>
                  <Input id="mainYear" name="mainYear" value={data.mainYear} onChange={handleChange} />
              </div>
          </div>
        </div>
        
        {/* Schedule */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">कार्यक्रम</h2>
          <div className="space-y-4">
            {data.schedule.map((item, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid grid-cols-2 gap-2 flex-grow">
                    <div className="space-y-2">
                        <Label>कार्यक्रमाचे नाव</Label>
                        <Input name="name" value={item.name} onChange={(e) => handleScheduleChange(index, e)} />
                    </div>
                    <div className="space-y-2">
                        <Label>तपशील (दिवस, तारीख, वेळ)</Label>
                        <Input name="details" value={item.details} onChange={(e) => handleScheduleChange(index, e)} />
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeScheduleItem(index)}><Trash2 className="h-5 w-5 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={addScheduleItem}><PlusCircle className="mr-2 h-4 w-4" /> नवीन कार्यक्रम जोडा</Button>
        </div>
        
        {/* Venue */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
           <h2 className="text-2xl font-headline font-bold text-primary mb-4">स्थळ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="venueName">स्थळाचे नाव</Label>
                    <Input id="venueName" name="venueName" value={data.venueName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="venueCity">शहर</Label>
                    <Input id="venueCity" name="venueCity" value={data.venueCity} onChange={handleChange} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venueMapLink">Google Maps लिंक</Label>
                    <Input id="venueMapLink" name="venueMapLink" value={data.venueMapLink} onChange={handleChange} />
                </div>
            </div>
        </div>

        {/* AI Helper */}
        <div className="p-6 border rounded-lg shadow-sm bg-accent/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-headline font-bold text-primary">AI मदत</h2>
                    <p className="text-muted-foreground">तुमच्या आमंत्रणासाठी वैयक्तिक मजकूर सूचना मिळवा.</p>
                </div>
                <Button onClick={handleAdaptContent} disabled={isAiLoading}>
                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    सूचना मिळवा
                </Button>
            </div>
            {data.suggestedMessage && <div className="mt-4 p-4 bg-background/50 rounded-lg">
                <h3 className="font-bold text-primary">AI ने सुचवलेला संदेश:</h3>
                <p className="text-primary/90 mt-2">{data.suggestedMessage}</p>
                <h3 className="font-bold text-primary mt-4">AI ने सुचवलेले डिझाइन बदल:</h3>
                <p className="text-primary/90 mt-2">{data.designAdjustments}</p>
            </div>}
        </div>
      </div>
      
      {aiSuggestions && (
        <Dialog open={!!aiSuggestions} onOpenChange={() => setAiSuggestions(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>AI ने तयार केलेल्या सूचना</DialogTitle>
                    <DialogDescription>
                        खालील सूचना तुमच्या आमंत्रणासाठी तयार केल्या आहेत.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <h4 className="font-semibold mb-2">सुचवलेला संदेश</h4>
                        <p className="p-3 bg-muted rounded-md text-sm">{aiSuggestions.suggestedMessage}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">रचनेतील बदल</h4>
                        <p className="p-3 bg-muted rounded-md text-sm">{aiSuggestions.designAdjustments}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setAiSuggestions(null)}>बंद करा</Button>
                    <Button onClick={() => applyAiSuggestion('suggestedMessage')}>सूचना लागू करा</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
