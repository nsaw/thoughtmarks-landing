import { useState, useMemo } from "react";
import { Check, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { BinWithCount } from "@shared/schema";
import { cn } from "@/lib/utils";

interface BinSelectorProps {
  bins: BinWithCount[];
  selectedBinId?: number;
  onBinSelect: (binId: number) => void;
  onCreateBin?: (name: string) => void;
  placeholder?: string;
}

export function BinSelector({
  bins,
  selectedBinId,
  onBinSelect,
  onCreateBin,
  placeholder = "Select a bin..."
}: BinSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedBin = bins.find(bin => bin.id === selectedBinId);

  // Sort bins: frequently used (by thoughtmark count) at top, then alphabetically
  const sortedBins = useMemo(() => {
    const frequentBins = bins
      .filter(bin => bin.thoughtmarkCount > 0)
      .sort((a, b) => b.thoughtmarkCount - a.thoughtmarkCount)
      .slice(0, 5); // Top 5 most used

    const otherBins = bins
      .filter(bin => bin.thoughtmarkCount === 0 || !frequentBins.includes(bin))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { frequentBins, otherBins };
  }, [bins]);

  // Filter bins based on search
  const filteredBins = useMemo(() => {
    if (!searchValue) return sortedBins;

    const query = searchValue.toLowerCase();
    const matchingBins = bins.filter(bin => 
      bin.name.toLowerCase().includes(query) ||
      bin.description?.toLowerCase().includes(query)
    );

    const frequent = matchingBins.filter(bin => 
      sortedBins.frequentBins.includes(bin)
    );
    const other = matchingBins.filter(bin => 
      !sortedBins.frequentBins.includes(bin)
    ).sort((a, b) => a.name.localeCompare(b.name));

    return { frequentBins: frequent, otherBins: other };
  }, [bins, searchValue, sortedBins]);

  const hasExactMatch = bins.some(bin => 
    bin.name.toLowerCase() === searchValue.toLowerCase()
  );

  const showCreateOption = searchValue && !hasExactMatch && onCreateBin;

  const handleCreateBin = () => {
    if (onCreateBin && searchValue) {
      onCreateBin(searchValue);
      setSearchValue("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white hover:bg-gray-700 focus:ring-[#C6D600] focus:border-[#C6D600]"
        >
          {selectedBin ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: selectedBin.color }}
              />
              {selectedBin.name}
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600" align="start">
        <Command className="bg-gray-800">
          <div className="flex items-center border-b border-gray-600 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search bins or type to create new..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 border-none focus:ring-0"
            />
          </div>
          <CommandList className="max-h-64">
            {showCreateOption && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateBin}
                  className="flex items-center gap-2 text-[#C6D600] cursor-pointer hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                  Create bin "{searchValue}"
                </CommandItem>
              </CommandGroup>
            )}
            
            {filteredBins.frequentBins.length > 0 && (
              <CommandGroup heading="Frequently Used">
                {filteredBins.frequentBins.map((bin) => (
                  <CommandItem
                    key={bin.id}
                    onSelect={() => {
                      onBinSelect(bin.id);
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: bin.color }}
                      />
                      <span>{bin.name}</span>
                      <span className="text-xs text-gray-400">
                        ({bin.thoughtmarkCount})
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBinId === bin.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredBins.otherBins.length > 0 && (
              <CommandGroup heading={filteredBins.frequentBins.length > 0 ? "All Bins" : "Bins"}>
                {filteredBins.otherBins.map((bin) => (
                  <CommandItem
                    key={bin.id}
                    onSelect={() => {
                      onBinSelect(bin.id);
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: bin.color }}
                      />
                      <span>{bin.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBinId === bin.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredBins.frequentBins.length === 0 && filteredBins.otherBins.length === 0 && !showCreateOption && (
              <CommandEmpty className="py-6 text-center text-sm text-gray-400">
                No bins found.
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}