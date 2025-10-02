'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/check-vehicle-recall.ts';
import '@/ai/flows/predict-vehicle-issues.ts';
