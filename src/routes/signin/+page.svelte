<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';
	import { signUpSchema } from '$lib/validations/signup/signupVail';
	import { z } from 'zod';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import { signInSchema } from '$lib/validations/signin/signinVail';

	$: ErrorUsername = { type: false, msg: '' };
	$: ErrorEmail = { type: false, msg: '' };
	$: ErrorPassword = { type: false, msg: '' };
	$: signUpButton = false;

	function makeSignUpErrorReset() {
		ErrorUsername.type = false;
		ErrorUsername.msg = '';
		ErrorEmail.type = false;
		ErrorEmail.msg = '';
		ErrorPassword.type = false;
		ErrorPassword.msg = '';
	}

	const submitFunctionSingUp: SubmitFunction = ({ cancel, formData }) => {
		const user = {
			username: formData.get('username'),
			email: formData.get('email'),
			password: formData.get('password')
		};

		signUpButton = true;

		try {
			signUpSchema.parse(user);
			makeSignUpErrorReset();
		} catch (err) {
			cancel();

			makeSignUpErrorReset();

			if (err instanceof z.ZodError) {
				err.issues.map((values) => {
					if (values.path[0] === 'username') {
						ErrorUsername.type = true;
						ErrorUsername.msg = values.message;
					} else if (values.path[0] === 'email') {
						ErrorEmail.type = true;
						ErrorEmail.msg = values.message;
					} else if (values.path[0] === 'password') {
						ErrorPassword.type = true;
						ErrorPassword.msg = values.message;
					}
				});
			}

			signUpButton = false;
		}

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				if (result.data.signUp.state === 'success') {
					signUpButton = false;
					update({ reset: true });
				}
			}
			if (result.type === 'error') {
				toast.error(result.error.message);
				signUpButton = false;
			}
		};
	};

	$: ErrorEmailSignIn = { type: false, msg: '' };
	$: ErrorPasswordSignIn = { type: false, msg: '' };

	function makeSignInErrorReset() {
		ErrorEmailSignIn.type = false;
		ErrorEmailSignIn.msg = '';
		ErrorPasswordSignIn.type = false;
		ErrorPasswordSignIn.msg = '';
	}

	$: singInButton = false;

	const submitFunctionSingIn: SubmitFunction = ({ formData, cancel }) => {
		const userData = {
			email: formData.get('email'),
			password: formData.get('password')
		};

		singInButton = true;

		try {
			signInSchema.parse(userData);
			makeSignInErrorReset();
		} catch (err) {
			cancel();

			makeSignInErrorReset();

			singInButton = false;

			if (err instanceof z.ZodError) {
				err.issues.map((values) => {
					console.log(values);

					if (values.path[0] === 'email') {
						ErrorEmailSignIn.type = true;
						ErrorEmailSignIn.msg = values.message;
					} else if (values.path[0] === 'password') {
						ErrorPasswordSignIn.type = true;
						ErrorPasswordSignIn.msg = values.message;
					}
				});
			}
		}

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				if (result.data.signUp.state === 'success') {
					singInButton = false;
					update({ reset: true });
				}
			}
			if (result.type === 'error') {
				toast.error(result.error.message);
				singInButton = false;
			}
		};
	};
</script>

<div class="backgroudImage flex min-h-[100vh] w-full flex-col items-center justify-center">
	<Toaster position="top-right" richColors />
	<div class="w-1/2">
		<Tabs.Root value="signin" class="w-full">
			<Tabs.List class="w-full">
				<Tabs.Trigger value="signin" class="w-[48%]">Sign In</Tabs.Trigger>
				<Tabs.Trigger value="signup" class="w-[48%]">Sign Up</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="signin">
				<Card>
					<CardHeader>
						<CardTitle class="text-xl">Welcome Back</CardTitle>
						<CardDescription>Time To Sign In</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							action="?/signin"
							use:enhance={submitFunctionSingIn}
							method="post"
							class="flex flex-col gap-5"
						>
							<div>
								<Label class="font-semibold">Email Address</Label>
								<Input type="email" name="email" placeholder="john@gmail.com" />
								{#if ErrorEmailSignIn.type}
									<p class="text-sm font-semibold text-red-600">{ErrorEmailSignIn.msg}</p>
								{:else}
									<p class="text-sm font-light">Enter your email address</p>
								{/if}
							</div>
							<div>
								<Label class="font-semibold">Password</Label>
								<Input type="password" name="password" placeholder="your secret password" />
								{#if ErrorPasswordSignIn.type}
									<p class="text-sm font-semibold text-red-600">{ErrorPasswordSignIn.msg}</p>
								{:else}
									<p class="text-sm font-light">Enter your password</p>
								{/if}
							</div>
							<div>
								{#if singInButton}
									<Button type="submit" class="w-full bg-green-600 hover:bg-green-700">
										<div role="status">
											<svg
												aria-hidden="true"
												class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
											<span class="sr-only">Loading...</span>
										</div>
									</Button>
								{:else}
									<Button type="submit" class="w-full bg-green-600 hover:bg-green-700"
										>Sign In</Button
									>
								{/if}
							</div>
						</form>
					</CardContent>
				</Card>
			</Tabs.Content>
			<Tabs.Content value="signup">
				<Card>
					<CardHeader>
						<CardTitle class="text-xl">Welcome To TimeLine</CardTitle>
						<CardDescription>Time To Sign up</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							use:enhance={submitFunctionSingUp}
							action="?/signup"
							method="POST"
							class="flex flex-col gap-5"
						>
							<div>
								<Label class="font-semibold">Username</Label>
								<Input type="text" name="username" placeholder="john wick" />
								{#if ErrorUsername.type}
									<p class="text-sm font-semibold text-red-600">{ErrorUsername.msg}</p>
								{:else}
									<p class="text-sm font-light">Enter your User Name</p>
								{/if}
							</div>
							<div>
								<Label class="font-semibold">Email Address</Label>
								<Input type="email" name="email" placeholder="john@gmail.com" />
								{#if ErrorEmail.type}
									<p class="text-sm font-semibold text-red-600">{ErrorEmail.msg}</p>
								{:else}
									<p class="text-sm font-light">Enter your email address</p>
								{/if}
							</div>
							<div>
								<Label class="font-semibold">Password</Label>
								<Input type="password" name="password" placeholder="your secret password" />
								{#if ErrorPassword.type}
									<p class="text-sm font-semibold text-red-600">{ErrorPassword.msg}</p>
								{:else}
									<p class="text-sm font-light">Enter your password</p>
								{/if}
							</div>
							<div>
								{#if signUpButton}
									<Button type="submit" class="w-full bg-green-600 hover:bg-green-700">
										<div role="status">
											<svg
												aria-hidden="true"
												class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
											<span class="sr-only">Loading...</span>
										</div>
									</Button>
								{:else}
									<Button type="submit" class="w-full bg-green-600 hover:bg-green-700"
										>Sign Up</Button
									>
								{/if}
							</div>
						</form>
					</CardContent>
				</Card></Tabs.Content
			>
		</Tabs.Root>
	</div>
</div>
