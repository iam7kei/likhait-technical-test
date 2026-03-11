/**
 * Form component for adding/editing expenses
 */

import React, { useEffect, useMemo } from "react";
import { Category, ExpenseFormData, SelectBoxOptionsType } from "../types";
import { EXPENSE_CATEGORIES } from "../constants/categories";
import { TextField, SelectBox, Button } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";

interface ExpenseFormProps {
    initialData?: Partial<ExpenseFormData>;
    initialCategoryData?: Category[];
    onSubmit: (data: ExpenseFormData) => Promise<void>;
    onAddNewCategory?: () => void;
    onCancel?: () => void;
    submitLabel?: string;
}

export function ExpenseForm({
    initialData,
    initialCategoryData,
    onSubmit,
    onAddNewCategory,
    onCancel,
    submitLabel = "Add Expense",
}: ExpenseFormProps) {
    const { formData, errors, isSubmitting, handleChange, handleSubmit, resetForm
    } =
        useExpenseForm({
            initialData,
            onSubmit,
        });

    const formStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    };

    const buttonGroupStyle: React.CSSProperties = {
        display: "flex",
        gap: "0.5rem",
        marginTop: "0.5rem",
    };

    const categoryOptions = useMemo(() => {

        let options: SelectBoxOptionsType[] = []

        if (initialCategoryData && initialCategoryData?.length > 0) {
            options = initialCategoryData.map((category: Category) => ({
                value: category.name,
                label: category.name,
                isAction: false,
            }));
            options.push({ value: "__add_new__", label: "Add New Category", isAction: true })
        } else {
            options = EXPENSE_CATEGORIES.map((category) => ({
                value: category,
                label: category,
                isAction: false
            }));
        }

        return options
    }, [initialCategoryData])

    const handleOnSelectBoxChange = (value: string) => {
        if (value === "__add_new__" && onAddNewCategory) {
            onAddNewCategory();
            return;
        }

        handleChange("category", value);
    }

    useEffect(() => {
        resetForm()
    }, [initialData])

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <TextField
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={errors.amount}
                fullWidth
                required
            />

            <TextField
                label="Description"
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                error={errors.description}
                fullWidth
                required
            />

            <SelectBox
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => handleOnSelectBoxChange(e.target.value)}
                error={errors.category}
                fullWidth
                required
            />

            <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                error={errors.date}
                fullWidth
                required
            />

            <div style={buttonGroupStyle}>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    fullWidth
                >
                    {isSubmitting ? "Submitting..." : submitLabel}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
