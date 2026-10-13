"use client"

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

// Develop for using a form in multiple components
// 3 seperate component share the same form

export const {
    fieldContext, // Stores a specific field. -> for ex: text 
    formContext,
    useFieldContext,  // Later you access => inside field components.  
    useFormContext, // Later you access => from any child component.
} = createFormHookContexts();  // This creates React Contexts. -> srav data store krte form cha 

export const {
    useAppForm, // developers use krte form sathi  
    useTypedAppFormContext,
} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {},
    formComponents: {}
});

//Form
//  ├── TextInputPanel
//  ├── VoiceSelector
//  └── SettingsPanel

// Form Context which stores the whole form
//form
//  ├── values
//  ├── errors
//  ├── isSubmitting
//  └── handleSubmit()