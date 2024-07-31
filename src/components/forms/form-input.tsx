import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type Props = {
    formControl: any
    inputType: string
    name: string
    label: string
    placeholder: string
    description?: string
}

function FormInput({ formControl, name, label, placeholder, description, inputType }: Props) {
    const renderInput = (field: any) => {
        switch (inputType) {
            case 'text':
                return <Input type="text" placeholder={placeholder} {...field} />
            case 'email':
                return <Input type="email" placeholder={placeholder} {...field} />
            case 'password':
                return <Input type="password" placeholder={placeholder} {...field} />
            case 'number':
                return <Input type="number" placeholder={placeholder} {...field} />
            case 'textarea':
                return <Textarea placeholder={placeholder} {...field} />
            case 'select':
                return <Select name="status" defaultValue="inStock">
                    <SelectTrigger id="status" aria-label="Select status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inStock">inStock</SelectItem>
                        <SelectItem value="lowStock">lowStock</SelectItem>
                        <SelectItem value="outOfStock">outOfStock</SelectItem>
                    </SelectContent>
                </Select>
            default:
                return <Input type="text" placeholder={placeholder} {...field} />
        }
    }

    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {renderInput(field)}
                    </FormControl>
                    {description && (
                        <FormDescription>
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormInput