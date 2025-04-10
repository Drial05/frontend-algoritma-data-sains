"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  async function hanleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    //console.log(res);

    if (!res.ok) {
      alert("Gagal Login");
      return;
    }

    const data = await res.json();
    setCookie("token", data.token, { maxAge: 60 * 60 * 24, path: "/" });

    setShowModal(true);

    setTimeout(() => {
      setProgress(40);
    }, 500);
    setTimeout(() => {
      setProgress(70);
    }, 1000);
    setTimeout(() => {
      setProgress(100);
    }, 1500);
  }

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }
  }, [progress, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan username Anda di bawah ini untuk masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={hanleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="example"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi Anda?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Dialog open={showModal}>
                  <DialogContent className="max-w-md text-center space-y-4">
                    <DialogTitle className="text-lg font-semibold mb-4">
                      Logging you in...
                    </DialogTitle>
                    {/* Tampilkan progress bar */}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {progress}%
                      </p>
                      <Progress value={progress} className="h2" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
