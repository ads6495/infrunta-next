import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

const mockLanguages = [
  { id: 1, code: "ro", name: "Romanian" },
  { id: 2, code: "en", name: "English" },
  { id: 3, code: "es", name: "Spanish" },
]

interface Unit {
  id: number
  title: string
  level: string
  orderNumber: number
  objectives: string
  languageName: string
  languageCode: string
  lessonCount: number
}

interface UnitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: Unit | null
  onClose: () => void
}

export function UnitDialog({ open, onOpenChange, unit, onClose }: UnitDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    orderNumber: "",
    objectives: "",
    languageCode: "",
  })

  useEffect(() => {
    if (unit) {
      setFormData({
        title: unit.title,
        level: unit.level,
        orderNumber: unit.orderNumber.toString(),
        objectives: unit.objectives,
        languageCode: unit.languageCode,
      })
    } else {
      setFormData({
        title: "",
        level: "",
        orderNumber: "",
        objectives: "",
        languageCode: "",
      })
    }
  }, [unit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Unit data:", formData)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{unit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
          <DialogDescription>
            {unit ? "Update the unit information below." : "Create a new learning unit."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Romanian"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.languageCode}
                  onValueChange={(value) => setFormData({ ...formData, languageCode: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLanguages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                type="number"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="1"
                min="1"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                placeholder="Describe what students will learn in this unit..."
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{unit ? "Update Unit" : "Create Unit"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
