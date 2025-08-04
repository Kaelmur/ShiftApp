import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";

const prisma = new PrismaClient();

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name } = req.body;

    const company = await prisma.company.create({ data: { name } });

    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    const company = await prisma.company.findUnique({ where: { id } });

    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    res.status(200).json(company);
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    const updated = await prisma.company.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    await prisma.company.delete({ where: { id } });

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    next(err);
  }
};
