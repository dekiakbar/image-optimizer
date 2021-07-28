import { Routes } from "nest-router";
import { OptimizeModule } from "./optimize/optimize.module";

export const routes: Routes = [
    {
        path: '/api/v1',
        module: OptimizeModule,
    },
];