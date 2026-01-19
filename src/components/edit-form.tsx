"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InvitationData } from "@/lib/initial-data";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Wand2, Loader2, Palette, Star } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FontSelector } from "./font-selector";

type EditFormProps = {
  data: InvitationData;
  setData: (data: InvitationData) => void;
};

const themes = [
  { name: "default", label: "Classic Maroon", primary: "hsl(333 62% 19%)", accent: "hsl(46 65% 52%)" },
  { name: "theme-royal-blue", label: "Royal Blue", primary: "hsl(220 90% 20%)", accent: "hsl(46 65% 52%)" },
  { name: "theme-emerald-green", label: "Emerald Green", primary: "hsl(150 80% 18%)", accent: "hsl(46 65% 52%)" },
  { name: "theme-ruby-red", label: "Ruby Red", primary: "hsl(345 80% 30%)", accent: "hsl(46 65% 52%)" },
  { name: "theme-royal-scroll", label: "Royal Scroll", primary: "hsl(30 40% 20%)", accent: "hsl(25 80% 50%)" },
  { name: "theme-autumn-floral", label: "Nature Floral", primary: "hsl(35 30% 90%)", accent: "hsl(140 40% 40%)" },
];


export function EditForm({ data, setData }: EditFormProps) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ suggestedMessage: string; designAdjustments: string; } | null>(null);
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');

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

  const handleFontChange = (field: string, fontValue: string) => {
    setData({
      ...data,
      fonts: {
        ...data.fonts,
        [field]: fontValue
      }
    });
  };

  const handleBoldChange = (field: string, isBold: boolean) => {
    setData({
      ...data,
      boldText: {
        ...data.boldText,
        [field]: isBold
      }
    });
  };

  const handleFontSizeChange = (field: string, size: string) => {
    setData({
      ...data,
      fontSizes: {
        ...data.fontSizes,
        [field]: size
      }
    });
  };

  const handleColorChange = (field: string, color: string) => {
    setData({
      ...data,
      colors: {
        ...data.colors,
        [field]: color
      }
    });
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

  const addGalleryItem = () => {
    if (!newMediaUrl) return;
    const newGallery = [...(data.gallery || [])];
    newGallery.push({ type: newMediaType, url: newMediaUrl });
    setData({ ...data, gallery: newGallery });
    setNewMediaUrl('');
  };

  const removeGalleryItem = (index: number) => {
    if (!data.gallery) return;
    const newGallery = data.gallery.filter((_, i) => i !== index);
    setData({ ...data, gallery: newGallery });
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


  const handleTopBannerChange = (checked: boolean) => {
    setData({
      ...data,
      topBanner: {
        text: data.topBanner?.text || "You are specially invited",
        enabled: checked,
      }
    });
  };

  const handleTopBannerTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      topBanner: {
        enabled: data.topBanner?.enabled || false,
        text: e.target.value
      }
    });
  };

  const handleTopBannerFontChange = (fontValue: string) => {
    setData({
      ...data,
      topBanner: {
        ...data.topBanner!,
        font: fontValue
      }
    });
  };

  const handleTopBannerBoldChange = (isBold: boolean) => {
    setData({
      ...data,
      topBanner: {
        ...data.topBanner!,
        bold: isBold
      }
    });
  };

  const handleTopBannerFontSizeChange = (size: string) => {
    setData({
      ...data,
      topBanner: {
        ...data.topBanner!,
        fontSize: size
      }
    });
  };

  const handleTopBannerColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      topBanner: {
        ...data.topBanner!,
        color: e.target.value
      }
    });
  };


  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 font-body" >
      <div className="space-y-8">

        {/* Theme Selector */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <div className="flex items-center gap-4 mb-4">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-primary">थीम निवडा</h2>
          </div>
          <RadioGroup value={data.theme} onValueChange={handleThemeChange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <Label key={theme.name} htmlFor={theme.name} className="flex flex-col items-center gap-2 border-2 rounded-lg p-3 cursor-pointer hover:border-primary has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                <RadioGroupItem value={theme.name} id={theme.name} className="sr-only" />
                <div className="flex gap-1 w-full h-8 rounded-md overflow-hidden">
                  <div className="w-2/3 h-full" style={{ backgroundColor: theme.primary }}></div>
                  <div className="w-1/3 h-full" style={{ backgroundColor: theme.accent }}></div>
                </div>
                <span className="text-sm font-medium">{theme.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Top Banner */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-headline font-bold text-primary">विशेष संदेश (Top Banner)</h2>
            </div>
            <Switch
              checked={data.topBanner?.enabled || false}
              onCheckedChange={handleTopBannerChange}
            />
          </div>

          {(data.topBanner?.enabled) && (
            <div className="animate-in fade-in zoom-in-95 duration-200 space-y-4">
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <Label htmlFor="topBannerText">संदेश</Label>
                <div className="w-auto">
                  <FontSelector
                    value={data.topBanner?.font || 'font-headline'}
                    onValueChange={handleTopBannerFontChange}
                    bold={data.topBanner?.bold ?? true}
                    onBoldChange={handleTopBannerBoldChange}
                    size={data.topBanner?.fontSize || 'text-xs sm:text-sm'}
                    onSizeChange={handleTopBannerFontSizeChange}
                  />
                </div>
              </div>
              <Input
                id="topBannerText"
                value={data.topBanner?.text || ""}
                onChange={handleTopBannerTextChange}
                placeholder="उदा. You are specially invited"
              />
              <div className="flex items-center gap-2 mt-2">
                <Label htmlFor="topBannerColor" className="whitespace-nowrap">Text Color:</Label>
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background">
                  <input
                    type="color"
                    id="topBannerColor"
                    value={data.topBanner?.color || "#ffffff"}
                    onChange={handleTopBannerColorChange}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                  <span className="text-xs text-muted-foreground w-16">{data.topBanner?.color || "#ffffff"}</span>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Main Details */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold text-primary">वधू आणि वर तपशील</h2>
            <div className="flex items-center gap-2">
              <Label htmlFor="hostSide" className="whitespace-nowrap">निमंत्रक पक्ष:</Label>
              <Select
                value={data.hostSide || 'bride'}
                onValueChange={(value: 'bride' | 'groom') => setData({ ...data, hostSide: value })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="निवडा" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">वधूपक्ष</SelectItem>
                  <SelectItem value="groom">वरपक्ष</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render based on hostSide: if bride, show bride first. If groom, show groom first. */}
            {(data.hostSide === 'groom' ? ['groom', 'bride'] : ['bride', 'groom']).map((side) => (
              <div key={side} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="font-semibold text-lg text-primary/90">{side === 'bride' ? 'वधू' : 'वर'}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <Label htmlFor={`${side}Name`}>{side === 'bride' ? 'वधूचे नाव' : 'वराचे नाव'}</Label>
                    <div className="w-auto">
                      <FontSelector
                        value={data.fonts?.[`${side}Name` as keyof typeof data.fonts] || 'font-headline'}
                        onValueChange={(v) => handleFontChange(`${side}Name`, v)}
                        bold={data.boldText?.[`${side}Name` as keyof typeof data.boldText] ?? true}
                        onBoldChange={(b) => handleBoldChange(`${side}Name`, b)}
                        size={data.fontSizes?.[`${side}Name` as keyof typeof data.fontSizes] || 'text-xl sm:text-3xl'}
                        onSizeChange={(s) => handleFontSizeChange(`${side}Name`, s)}
                      />
                      <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                        <input
                          type="color"
                          value={data.colors?.[`${side}Name` as keyof typeof data.colors] || "#ffffff"}
                          onChange={(e) => handleColorChange(`${side}Name`, e.target.value)}
                          className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <Input id={`${side}Name`} name={`${side}Name`} value={side === 'bride' ? data.brideName : data.groomName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <Label htmlFor={`${side}ParentsDetails`}>{side === 'bride' ? 'वधूचे पालक / तपशील' : 'वराचे पालक / तपशील'}</Label>
                    <div className="w-auto flex gap-2">
                      <FontSelector
                        value={data.fonts?.[`${side}Parents` as keyof typeof data.fonts] || 'font-body'}
                        onValueChange={(v) => handleFontChange(`${side}Parents`, v)}
                        bold={data.boldText?.[`${side}Parents` as keyof typeof data.boldText] ?? false}
                        onBoldChange={(b) => handleBoldChange(`${side}Parents`, b)}
                        size={data.fontSizes?.[`${side}Parents` as keyof typeof data.fontSizes] || 'text-xs'}
                        onSizeChange={(s) => handleFontSizeChange(`${side}Parents`, s)}
                      />
                      <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                        <input
                          type="color"
                          value={data.colors?.[`${side}Parents` as keyof typeof data.colors] || "#ffffff"}
                          onChange={(e) => handleColorChange(`${side}Parents`, e.target.value)}
                          className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <Input
                    id={`${side}ParentsDetails`}
                    name={`${side}ParentsDetails`}
                    value={
                      side === 'bride'
                        ? (data.brideParentsDetails ?? `श्री. ${data.brideFather} व श्रीमती ${data.brideMother} यांची ज्येष्ठ कन्या`)
                        : (data.groomParentsDetails ?? `श्री. ${data.groomFather} व श्रीमती ${data.groomMother} यांचे ज्येष्ठ चिरंजीव`)
                    }
                    onChange={handleChange}
                    placeholder={side === 'bride' ? "श्री. ... यांची ज्येष्ठ कन्या" : "श्री. ... यांचे ज्येष्ठ चिरंजीव"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        {/* Images/Gallery */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">फोटो आणि व्हिडिओ गॅलरी</h2>

          {/* Legacy single image support - optional, or we can just migrate visualy */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>नवीन मीडिया जोडा</Label>
              <div className="flex gap-2">
                <Select value={newMediaType} onValueChange={(v: 'image' | 'video') => setNewMediaType(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">फोटो</SelectItem>
                    <SelectItem value="video">व्हिडिओ</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder={newMediaType === 'image' ? "Image URL" : "Video URL"}
                  className="flex-grow"
                />
                <Button onClick={addGalleryItem} type="button">Add</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {/* Show legacy coupleImageUrl if it exists and gallery is empty - strictly for migration visualization, 
                     but best to encourage adding to gallery. We will just show gallery here. */}
              {data.gallery && data.gallery.map((item, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden aspect-[3/4] bg-muted">
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/10">
                      <span className="text-xs font-mono">Video</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => removeGalleryItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate px-2">
                    {item.url}
                  </div>
                </div>
              ))}
            </div>

            {(!data.gallery || data.gallery.length === 0) && data.coupleImageUrl && (
              <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  Note: You representatively have a single "Couple Image" set. Add items to the gallery above to upgrade to the new scrolling view.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.coupleImageUrl} alt="" className="w-16 h-16 object-cover rounded" />
                  <span className="text-xs text-muted-foreground truncate">{data.coupleImageUrl}</span>
                </div>
              </div>
            )}
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
              <Label htmlFor="mainMonth">महिना</Label>
              <Input id="mainMonth" name="mainMonth" value={data.mainMonth || ''} onChange={handleChange} placeholder="जुलै" />
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

          <div className="mt-4 space-y-2">
            {/* Date Font */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>तारीख फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.mainDate || 'font-headline'}
                  onValueChange={(v) => handleFontChange('mainDate', v)}
                  bold={data.boldText?.mainDate ?? true}
                  onBoldChange={(b) => handleBoldChange('mainDate', b)}
                  size={data.fontSizes?.mainDate || 'text-6xl sm:text-9xl'}
                  onSizeChange={(s) => handleFontSizeChange('mainDate', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.mainDate || "#ffffff"}
                    onChange={(e) => handleColorChange('mainDate', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Day Font */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>दिवस फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.mainDay || 'font-serif'}
                  onValueChange={(v) => handleFontChange('mainDay', v)}
                  bold={data.boldText?.mainDay ?? false}
                  onBoldChange={(b) => handleBoldChange('mainDay', b)}
                  size={data.fontSizes?.mainDay || 'text-2xl'}
                  onSizeChange={(s) => handleFontSizeChange('mainDay', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.mainDay || "#ffffff"}
                    onChange={(e) => handleColorChange('mainDay', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Month Font */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>महिना फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.mainMonth || 'font-body'}
                  onValueChange={(v) => handleFontChange('mainMonth', v)}
                  bold={data.boldText?.mainMonth ?? false}
                  onBoldChange={(b) => handleBoldChange('mainMonth', b)}
                  size={data.fontSizes?.mainMonth || 'text-xl'}
                  onSizeChange={(s) => handleFontSizeChange('mainMonth', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.mainMonth || "#ffffff"}
                    onChange={(e) => handleColorChange('mainMonth', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Time Font */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>वेळ फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.mainTime || 'font-body'}
                  onValueChange={(v) => handleFontChange('mainTime', v)}
                  bold={data.boldText?.mainTime ?? false}
                  onBoldChange={(b) => handleBoldChange('mainTime', b)}
                  size={data.fontSizes?.mainTime || 'text-xl'}
                  onSizeChange={(s) => handleFontSizeChange('mainTime', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.mainTime || "#ffffff"}
                    onChange={(e) => handleColorChange('mainTime', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Year Font */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>वर्ष फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.mainYear || 'font-body'}
                  onValueChange={(v) => handleFontChange('mainYear', v)}
                  bold={data.boldText?.mainYear ?? true}
                  onBoldChange={(b) => handleBoldChange('mainYear', b)}
                  size={data.fontSizes?.mainYear || 'text-5xl'}
                  onSizeChange={(s) => handleFontSizeChange('mainYear', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.mainYear || "#ffffff"}
                    onChange={(e) => handleColorChange('mainYear', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>शुभ मुहूर्त शीर्षक फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.shubhMuhhurt || 'font-headline'}
                  onValueChange={(v) => handleFontChange('shubhMuhhurt', v)}
                  bold={data.boldText?.shubhMuhhurt ?? true}
                  onBoldChange={(b) => handleBoldChange('shubhMuhhurt', b)}
                  size={data.fontSizes?.shubhMuhhurt || 'text-2xl sm:text-4xl'}
                  onSizeChange={(s) => handleFontSizeChange('shubhMuhhurt', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.shubhMuhhurt || "#ffffff"}
                    onChange={(e) => handleColorChange('shubhMuhhurt', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label htmlFor="weddingHeader">लग्नाचे शीर्षक (उदा. शुभविवाह)</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.weddingHeader || 'font-custom-header'}
                  onValueChange={(v) => handleFontChange('weddingHeader', v)}
                  bold={data.boldText?.weddingHeader ?? false}
                  onBoldChange={(b) => handleBoldChange('weddingHeader', b)}
                  size={data.fontSizes?.weddingHeader || 'text-4xl sm:text-6xl'}
                  onSizeChange={(s) => handleFontSizeChange('weddingHeader', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.weddingHeader || "#ffffff"}
                    onChange={(e) => handleColorChange('weddingHeader', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <Input id="weddingHeader" name="weddingHeader" value={data.weddingHeader || 'शुभविवाह'} onChange={handleChange} />
            <p className="text-xs text-muted-foreground">जर तुम्ही AMS फॉन्ट वापरत असाल तर येथे AMS कोडिंग टाका.</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label htmlFor="requestMessage">निमंत्रण संदेश</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.requestMessage || 'font-body'}
                  onValueChange={(v) => handleFontChange('requestMessage', v)}
                  bold={data.boldText?.requestMessage ?? false}
                  onBoldChange={(b) => handleBoldChange('requestMessage', b)}
                  size={data.fontSizes?.requestMessage || 'text-lg'}
                  onSizeChange={(s) => handleFontSizeChange('requestMessage', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.requestMessage || "#ffffff"}
                    onChange={(e) => handleColorChange('requestMessage', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <Textarea
              id="requestMessage"
              name="requestMessage"
              value={data.requestMessage ?? "या शुभमुहूर्तावर करण्याचे योजिले आहे, तरी या मंगलप्रसंगी आपण उपस्थित राहून वधू-वरास शुभाशीर्वाद द्यावेत, ह्यासाठीचे हे अग्रहाचे निमंत्रण."}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">कार्यक्रम</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <Label htmlFor="scheduleSectionTitle">विभाग शीर्षक (उदा. कार्यक्रमाची रूपरेषा)</Label>
                <div className="w-auto flex gap-2">
                  <FontSelector
                    value={data.fonts?.scheduleSectionTitle || 'font-headline'}
                    onValueChange={(v) => handleFontChange('scheduleSectionTitle', v)}
                    bold={data.boldText?.scheduleSectionTitle ?? true}
                    onBoldChange={(b) => handleBoldChange('scheduleSectionTitle', b)}
                    size={data.fontSizes?.scheduleSectionTitle || 'text-2xl sm:text-4xl'}
                    onSizeChange={(s) => handleFontSizeChange('scheduleSectionTitle', s)}
                  />
                  <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                    <input
                      type="color"
                      value={data.colors?.scheduleSectionTitle || "#ffffff"}
                      onChange={(e) => handleColorChange('scheduleSectionTitle', e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
              <Input id="scheduleSectionTitle" name="scheduleSectionTitle" value={data.scheduleSectionTitle || 'कार्यक्रमाची रूपरेषा'} onChange={handleChange} />
            </div>
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
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>कार्यक्रम नाव फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.scheduleName || 'font-headline'}
                  onValueChange={(v) => handleFontChange('scheduleName', v)}
                  bold={data.boldText?.scheduleName ?? true}
                  onBoldChange={(b) => handleBoldChange('scheduleName', b)}
                  size={data.fontSizes?.scheduleName || 'text-xl sm:text-3xl'}
                  onSizeChange={(s) => handleFontSizeChange('scheduleName', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.scheduleName || "#ffffff"}
                    onChange={(e) => handleColorChange('scheduleName', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <Label>कार्यक्रम तपशील फॉन्ट</Label>
              <div className="w-auto flex gap-2">
                <FontSelector
                  value={data.fonts?.scheduleDetails || 'font-serif'}
                  onValueChange={(v) => handleFontChange('scheduleDetails', v)}
                  bold={data.boldText?.scheduleDetails ?? false}
                  onBoldChange={(b) => handleBoldChange('scheduleDetails', b)}
                  size={data.fontSizes?.scheduleDetails || 'text-xl'}
                  onSizeChange={(s) => handleFontSizeChange('scheduleDetails', s)}
                />
                <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                  <input
                    type="color"
                    value={data.colors?.scheduleDetails || "#ffffff"}
                    onChange={(e) => handleColorChange('scheduleDetails', e.target.value)}
                    className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">स्थळ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <Label htmlFor="venueName">स्थळाचे नाव</Label>
                <div className="w-auto flex gap-2">
                  <FontSelector
                    value={data.fonts?.place || 'font-headline'}
                    onValueChange={(v) => handleFontChange('place', v)}
                    bold={data.boldText?.place ?? true}
                    onBoldChange={(b) => handleBoldChange('place', b)}
                    size={data.fontSizes?.place || 'text-2xl sm:text-5xl'}
                    onSizeChange={(s) => handleFontSizeChange('place', s)}
                  />
                  <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                    <input
                      type="color"
                      value={data.colors?.place || "#ffffff"}
                      onChange={(e) => handleColorChange('place', e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
              <Input id="venueName" name="venueName" value={data.venueName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <Label htmlFor="venueCity">शहर</Label>
                <div className="w-auto flex gap-2">
                  <FontSelector
                    value={data.fonts?.venueCity || 'font-body'}
                    onValueChange={(v) => handleFontChange('venueCity', v)}
                    bold={data.boldText?.venueCity ?? false}
                    onBoldChange={(b) => handleBoldChange('venueCity', b)}
                    size={data.fontSizes?.venueCity || 'text-xl sm:text-3xl'}
                    onSizeChange={(s) => handleFontSizeChange('venueCity', s)}
                  />
                  <div className="flex items-center gap-2 border rounded-md p-1 pl-2 bg-background h-10 w-auto">
                    <input
                      type="color"
                      value={data.colors?.venueCity || "#ffffff"}
                      onChange={(e) => handleColorChange('venueCity', e.target.value)}
                      className="h-6 w-8 cursor-pointer rounded border-none p-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>
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
      )
      }
    </div >
  );
}
