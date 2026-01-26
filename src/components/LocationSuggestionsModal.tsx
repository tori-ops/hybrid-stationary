'use client';

import { useState, useEffect } from 'react';
import { getLocationSuggestions, LocationSuggestion } from '@/lib/locationUtils';

interface LocationSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string; // 'attractions', 'dining', 'shopping', 'accommodations'
  venueLat: number;
  venueLon: number;
  onAddItems: (items: any[]) => void;
  accentColor?: string;
  secondaryColor?: string;
}

export default function LocationSuggestionsModal({
  isOpen,
  onClose,
  category,
  venueLat,
  venueLon,
  onAddItems,
  accentColor = '#db2777',
  secondaryColor = '#274E13',
}: LocationSuggestionsModalProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryLabels: { [key: string]: string } = {
    attractions: 'Local Attractions',
    dining: 'Dining Scene',
    shopping: 'Local Shopping',
    accommodations: 'Overnight Stays',
  };

  useEffect(() => {
    if (isOpen && venueLat && venueLon) {
      fetchSuggestions();
    }
  }, [isOpen, category, venueLat, venueLon]);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setSelected(new Set());

    try {
      const results = await getLocationSuggestions(category, venueLat, venueLon, 15);
      setSuggestions(results);

      if (results.length === 0) {
        setError('No results found in this area. Try a different category.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleAddSelected = () => {
    const selectedItems = suggestions
      .filter((s) => selected.has(s.id))
      .map((s) => ({
        name: s.name,
        description: `${s.type} - ${s.distance.toFixed(1)} miles away`,
      }));

    if (selectedItems.length > 0) {
      onAddItems(selectedItems);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className="p-4 text-white"
          style={{ backgroundColor: secondaryColor }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {categoryLabels[category] || category}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-75 transition-opacity text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-xs mt-1 opacity-90">
            {suggestions.length} results within 15 miles
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: secondaryColor }}></div>
                <p className="text-sm text-gray-600 mt-2">Loading suggestions...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchSuggestions}
                className="mt-3 px-4 py-2 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: secondaryColor }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <label
                  key={suggestion.id}
                  className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(suggestion.id)}
                    onChange={() => toggleSelection(suggestion.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{suggestion.name}</p>
                    <p className="text-xs text-gray-600">
                      {suggestion.type} • {suggestion.distance.toFixed(1)} miles
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && suggestions.length > 0 && (
          <div className="p-4 border-t flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-sm font-semibold border-2"
              style={{ color: secondaryColor, borderColor: secondaryColor }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelected}
              disabled={selected.size === 0}
              className="px-4 py-2 rounded text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: accentColor }}
            >
              Add {selected.size} Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
