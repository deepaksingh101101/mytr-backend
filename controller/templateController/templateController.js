
import {validationResult} from 'express-validator'
import templateModel from '../../models/templateModel.js';


export const saveTemplateFormData = async (req, res, next) => {
    const errors = validationResult(req);
    const { caseType, questions, createdBy } = req.body;

    try {
        if (errors.isEmpty()) {
            // Create a new instance of the consent model
            const template = await templateModel.create({
                caseType,
                questions,
                createdBy
            });


            // Save the consent data to the database
            await template.save();

            return res.status(200).json({ status: true, message: "Template data saved successfully" });
        } else {
            return res.status(422).json({ status: false, errors: errors.array() });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


export const getAllTemplate = async (req, res, next) => {
    try {
        // Retrieve all templates from the database
        const templates = await templateModel.find();

        return res.status(200).json({ status: true, templates });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


export const editTemplateById = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ status: false, errors: errors.array() });
        }

        const  templateId  = req.query.templateId;
      
        const { caseType, questions, updatedBy } = req.body;
        caseType = caseType.toLowerCase();

        // Find the template by ID and update it
        const updatedTemplate = await templateModel.findByIdAndUpdate(templateId, { caseType, questions, updatedBy }, { new: true });

        if (!updatedTemplate) {
            return res.status(404).json({ status: false, message: "Template not found" });
        }

        return res.status(200).json({ status: true, message: "Template updated successfully", template: updatedTemplate });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

// Delete template by ID
export const deleteTemplateById = async (req, res, next) => {
    try {
        const  templateId  = req.query.templateId;
        // Find the template by ID and delete it
        const deletedTemplate = await templateModel.findByIdAndDelete(templateId);

        if (!deletedTemplate) {
            return res.status(404).json({ status: false, message: "Template not found" });
        }

        return res.status(200).json({ status: true, message: "Template deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



export const getTemplateById = async (req, res, next) => {
    try {
        const  templateId  = req.query.templateId;
        // Find the template by ID and delete it
        const template = await templateModel.findById(templateId);

        if (!template) {
            return res.status(404).json({ status: false, message: "Template not found" });
        }

        return res.status(200).json({ status: true,template });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



export const getTemplateByCaseType = async (req, res, next) => {
    try {
        let caseType = req.query.caseType.toLowerCase(); // Convert to lowercase

        const template = await templateModel.find({ caseType });

        if (!template) {
            return res.status(404).json({ status: false, message: "No Template found with this Case" });
        }

        return res.status(200).json({ status: true, template });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};
