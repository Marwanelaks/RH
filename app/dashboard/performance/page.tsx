"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Star, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define validation schema
const performanceSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, "Feedback must be at least 10 characters"),
});

type PerformanceForm = z.infer<typeof performanceSchema>;

export default function PerformancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    completedReviews: 0,
    totalEmployees: 0,
    improvement: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PerformanceForm>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      employeeId: "",
      rating: 3,
      feedback: ""
    }
  });

  useEffect(() => {
    fetchPerformanceData();
    fetchEmployees();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch("/api/performance");
      if (!response.ok) throw new Error("Failed to fetch performance data");
      
      const data = await response.json();
      setReviews(data.performances);
      
      // Calculate stats
      const employeeResponse = await fetch("/api/employees");
      const employeeData = await employeeResponse.json();
      const totalEmployees = employeeData.length;
      const completedReviews = data.performances.length;
      const improvement = calculateImprovement(data.performances);

      setStats({
        averageRating: data.stats.averageRating,
        completedReviews,
        totalEmployees,
        improvement
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive",
      });
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (!response.ok) throw new Error("Failed to fetch employees");
      
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    }
  };

  const calculateImprovement = (performances) => {
    if (performances.length < 2) return 0;
    
    // Simple calculation - compare last 2 quarters
    const lastQuarter = performances
      .slice(0, Math.floor(performances.length / 2))
      .reduce((sum, p) => sum + p.rating, 0) / Math.floor(performances.length / 2);
      
    const currentQuarter = performances
      .slice(Math.floor(performances.length / 2))
      .reduce((sum, p) => sum + p.rating, 0) / Math.floor(performances.length / 2);
      
    return ((currentQuarter - lastQuarter) / lastQuarter) * 100;
  };

  const onSubmit = async (data: PerformanceForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create performance review");
      }
  
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      
      // Update stats
      const newAverage = (stats.averageRating * stats.completedReviews + newReview.rating) / 
                         (stats.completedReviews + 1);
      
      setStats({
        ...stats,
        averageRating: newAverage,
        completedReviews: stats.completedReviews + 1,
        improvement: calculateImprovement([newReview, ...reviews])
      });
      
      toast({
        title: "Performance review submitted",
        description: "The evaluation has been successfully recorded.",
      });
  
      reset();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error submitting review",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Évaluations et Feedback</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle Évaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Évaluation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employé</label>
                  <Controller
                    name="employeeId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.employeeId && (
                    <p className="text-sm text-destructive">{errors.employeeId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Note</label>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Attribuer une note" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} {rating === 1 ? 'étoile' : 'étoiles'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.rating && (
                    <p className="text-sm text-destructive">{errors.rating.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback</label>
                  <Controller
                    name="feedback"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Commentaires détaillés..."
                        {...field}
                      />
                    )}
                  />
                  {errors.feedback && (
                    <p className="text-sm text-destructive">{errors.feedback.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => reset()}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "En cours..." : "Soumettre"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}% depuis la dernière période
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Évaluations Complétées</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReviews}</div>
            <p className="text-xs text-muted-foreground">
              Sur {stats.totalEmployees} employés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Amélioration globale</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Historique des Évaluations</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Commentaires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews
                .filter(review => 
                  review.employee.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  review.feedback.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.employee.user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {review.rating}
                      <Star className="h-4 w-4 text-yellow-500 ml-1" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.feedback}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}