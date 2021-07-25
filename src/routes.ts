import { Routes } from "nest-router";
import { OptimizerModule } from "./optimizer/optimizer.module";

export const routes: Routes = [
    {
        path: '/api/v1',
        module: OptimizerModule,
    },
];