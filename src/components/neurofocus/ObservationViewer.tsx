'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Observation {
  childName: string;
  age: number;
  diagnosis?: string;
  attention?: string[];
  strengths?: string[];
  screenTime?: string;
  notes: string;
  createdAt: string;
}

export default function ObservationViewer() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selected, setSelected] = useState<Observation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchObservations();
  }, []);

  const fetchObservations = async () => {
    try {
      const response = await fetch('/api/eren/observation');
      if (!response.ok) throw new Error('Failed to fetch observations');
      const data = await response.json();
      setObservations(data);
    } catch (error) {
      console.error('Error fetching observations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gözlem Kayıtları</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filtrele
          </Button>
          <Button variant="outline" size="sm">
            Sırala
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {observations.map((obs, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => setSelected(obs)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{obs.childName}</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(obs.createdAt), 'd MMMM yyyy', { locale: tr })}
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-3">
              {obs.notes.length > 120 ? `${obs.notes.slice(0, 120)}...` : obs.notes}
            </div>

            <div className="flex flex-wrap gap-2">
              {obs.attention?.map((item, i) => (
                <Badge key={i} variant="outline" className="bg-red-50">
                  {item}
                </Badge>
              ))}
              {obs.strengths?.map((strength, i) => (
                <Badge key={i} variant="outline" className="bg-green-50">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{selected.childName}</h3>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(selected.createdAt), 'd MMMM yyyy', { locale: tr })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Temel Bilgiler</h4>
                  <ul className="space-y-2">
                    <li>
                      <strong>Yaş:</strong> {selected.age} yaş
                    </li>
                    {selected.diagnosis && (
                      <li>
                        <strong>Tanı:</strong> {selected.diagnosis}
                      </li>
                    )}
                    {selected.screenTime && (
                      <li>
                        <strong>Teknoloji Kullanımı:</strong> {selected.screenTime}
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Gözlem Detayları</h4>
                  <div className="space-y-2">
                    {selected.attention && (
                      <div>
                        <strong>Dikkat Zorlukları:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selected.attention.map((item, i) => (
                            <Badge key={i} variant="outline" className="bg-red-50">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selected.strengths && (
                      <div>
                        <strong>Güçlü Yanları:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selected.strengths.map((strength, i) => (
                            <Badge key={i} variant="outline" className="bg-green-50">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Notlar</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selected.notes}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
