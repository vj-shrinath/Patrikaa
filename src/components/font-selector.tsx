
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Minus, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type FontSelectorProps = {
    value: string;
    onValueChange: (value: string) => void;
    bold?: boolean;
    onBoldChange?: (bold: boolean) => void;
    size?: string;
    onSizeChange?: (size: string) => void;
    label?: string;
    id?: string;
};

export const AVAILABLE_FONTS = [
    { name: "Default (Tiro Devanagari)", value: "font-headline" },
    { name: "Mukta (Modern)", value: "font-mukta" },
    { name: "Baloo 2 (Rounded)", value: "font-baloo" },
    { name: "Yatra One (Bold)", value: "font-yatra" },
    { name: "Modak (Heavy)", value: "font-modak" },
    { name: "Gotu (Calligraphic)", value: "font-gotu" },
    { name: "Rozha One (High Contrast)", value: "font-rozha" },
    { name: "Laila (Decorative)", value: "font-laila" },
    { name: "Sahitya (Serif)", value: "font-sahitya" },
    { name: "Custom Header (AMS)", value: "font-custom-header" },
];

// Defined scale of responsive sizes
const SIZE_SCALE = [
    { label: 'XS', value: 'text-xs' },
    { label: 'S', value: 'text-sm' },
    { label: 'M', value: 'text-base' },
    { label: 'L', value: 'text-lg' },
    { label: 'XL', value: 'text-xl sm:text-2xl' },
    { label: '2XL', value: 'text-2xl sm:text-3xl' }, // Default for Bride/Groom is close to this (xl/3xl)
    { label: '3XL', value: 'text-3xl sm:text-4xl' },
    { label: '4XL', value: 'text-4xl sm:text-5xl' },
    { label: '5XL', value: 'text-5xl sm:text-6xl' }, // Default for Wedding Header is close to this (4xl/6xl)
    { label: '6XL', value: 'text-6xl sm:text-7xl' },
];

export function FontSelector({ value, onValueChange, bold, onBoldChange, size, onSizeChange, label, id }: FontSelectorProps) {

    const handleSizeChange = (direction: 'up' | 'down') => {
        if (!onSizeChange || !size) return;

        // Find current index
        let currentIndex = SIZE_SCALE.findIndex(s => s.value === size);

        // If not found (custom or initial default), try to approximate or default to middle
        if (currentIndex === -1) {
            // Map known defaults to scale
            if (size.includes('text-4xl sm:text-6xl')) currentIndex = 8; // 5XL equiv
            else if (size.includes('text-2xl sm:text-5xl')) currentIndex = 7; // 4XL equiv
            else if (size.includes('text-xl sm:text-3xl')) currentIndex = 5; // 2XL equiv
            else currentIndex = 4; // Default to 'L'
        }

        const newIndex = direction === 'up'
            ? Math.min(currentIndex + 1, SIZE_SCALE.length - 1)
            : Math.max(currentIndex - 1, 0);

        onSizeChange(SIZE_SCALE[newIndex].value);
    };

    return (
        <div className="flex flex-col gap-1.5">
            {label && <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>}
            <div className="flex gap-2">
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger id={id} className="h-9 w-full min-w-[120px]">
                        <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                        {AVAILABLE_FONTS.map((font) => (
                            <SelectItem key={font.value} value={font.value} className={font.value}>
                                {font.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {onSizeChange && (
                    <div className="flex items-center border rounded-md h-9 bg-background">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none rounded-l-md px-2"
                            onClick={() => handleSizeChange('down')}
                            type="button"
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-8 flex justify-center items-center border-l border-r h-4">
                            <span className="text-[10px] font-mono leading-none">
                                <Type className="h-3 w-3" />
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none rounded-r-md px-2"
                            onClick={() => handleSizeChange('up')}
                            type="button"
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                )}

                {onBoldChange && (
                    <Toggle
                        pressed={bold}
                        onPressedChange={onBoldChange}
                        aria-label="Toggle bold"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 px-0 border-input"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                )}
            </div>
        </div>
    );
}
